<script setup lang="ts">
import { z } from "zod";
import { useStorage } from "@vueuse/core";
import type { FormSubmitEvent } from "#ui/types";
import {
  Collections,
  type PublishersResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";

type Tmetadata = Record<string, never>;
type Texpand = {
  "releases(title)": ReleasesResponse<{
    publisher: PublishersResponse;
  }>[];
};

const route = useRoute();
const { $pb } = useNuxtApp();
const { pending, post } = useReview();
const { t } = useI18n({ useScope: "global" });

const titleId = ref("");

if (route.query.title && !Array.isArray(route.query.title)) {
  titleId.value = route.query.title;
}

const { data: title } = await useAsyncData(
  () =>
    $pb
      .collection(Collections.Titles)
      .getOne<TitlesResponse<Tmetadata, Texpand>>(titleId.value, {
        expand: "releases(title),releases(title).publisher",
      }),
  {
    watch: [titleId],
  },
);

const releases = computed(() =>
  title.value?.expand?.["releases(title)"].map((release) => ({
    id: release.id,
    label: release.name,
    avatar: {
      src: release.expand?.publisher
        ? $pb.files.getURL(
            release.expand?.publisher,
            release.expand?.publisher.logo,
          )
        : undefined,
    },
  })),
);

const schema = z.object({
  release: z.string().min(1, t("error.review.releaseInvalid")),
  header: z
    .string()
    .min(1, t("error.review.headerInvalidMin"))
    .max(120, t("error.review.headerInvalidMax")),
  score: z.coerce
    .number()
    .min(1, t("error.review.scoreInvalidMin"))
    .max(10, t("error.review.scoreInvalidMax")),
});
type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  release: undefined,
  header: undefined,
  score: undefined,
});

const content = useStorage("review-content", "");
const currentRelease = computed(() =>
  releases.value?.find((release) => release.id === state.value.release),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await post({
    ...event.data,
    user: $pb.authStore.record?.id,
    content: content.value,
  });
}

definePageMeta({
  middleware: ["verified"],
});
</script>

<template>
  <div>
    <AppH1 class="mb-6">{{ $t("review.create") }}</AppH1>

    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col-reverse gap-6 sm:flex-row"
      @submit="onSubmit"
    >
      <div class="flex-1">
        <UAlert
          :title="$t('review.termsTitle')"
          :description="$t('review.termsDescription')"
          icon="i-fluent-document-endnote-20-filled"
          class="mb-6"
        />
        <UFormGroup name="header" class="mb-6">
          <UInput
            v-model="state.header"
            name="header"
            :placeholder="$t('review.header')"
          />
        </UFormGroup>
        <AppEditor v-model="content" class="mb-6" />
      </div>
      <div class="w-full flex-shrink-0 sm:w-64">
        <div class="space-y-6">
          <UFormGroup :label="$t('review.title')">
            <AppTitleSelect v-model="titleId" :initial-name="title?.name" />
          </UFormGroup>
          <UFormGroup :label="$t('review.release')" name="release">
            <USelectMenu
              v-model="state.release"
              :options="releases || []"
              :loading="pending"
              :disabled="!releases || releases.length == 0"
              value-attribute="id"
              option-attribute="label"
            >
              <span v-if="currentRelease">{{ currentRelease.label }}</span>
              <span v-else>{{ $t("review.releaseSelect") }}</span>
            </USelectMenu>
          </UFormGroup>
          <UFormGroup :label="$t('review.score')" name="score">
            <UInput
              v-model="state.score"
              placeholder="8.5"
              icon="i-fluent-number-symbol-20-filled"
              type="number"
              min="0"
              max="10"
            >
              <template #trailing>
                <span class="text-xs text-neutral-500 dark:text-neutral-400">
                  /10
                </span>
              </template>
            </UInput>
          </UFormGroup>
          <UButton trailing-icon="i-fluent-send-20-filled" block type="submit">
            {{ $t("review.action.create") }}
          </UButton>
        </div>
      </div>
    </UForm>
  </div>
</template>
