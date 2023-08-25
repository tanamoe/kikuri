<script setup lang="ts">
import { z } from "zod";
import { storeToRefs } from "pinia";
import { useStorage } from "@vueuse/core";
import type { Form } from "@nuxthq/ui/dist/runtime/types";
import {
  Collections,
  type PublisherResponse,
  type ReleaseResponse,
  type TitleResponse,
} from "@/types/pb";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const { $pb } = useNuxtApp();
const { pending, post } = useReview();
const store = useUserStore();
const { t } = useI18n({ useScope: "global" });

const { currentUser } = storeToRefs(store);

const { data: title } = await useAsyncData(
  () =>
    $pb
      .collection(Collections.Title)
      .getOne<TitleResponse>(route.query.title as string),
  {
    transform: (title) => structuredClone(title),
  },
);

const { data: releases, pending: releasesPending } = await useLazyAsyncData(
  () => {
    state.value.release = undefined;
    return $pb.collection(Collections.Release).getFullList<
      ReleaseResponse<{
        publisher: PublisherResponse;
      }>
    >({
      filter: `title = '${route.query.title || title.value?.id}'`,
      expand: "publisher,title",
      pick: "id,name,publisher,title",
    });
  },
  {
    server: false,
    watch: [title],
    transform: (releases) =>
      structuredClone(releases).map((release) => ({
        id: release.id,
        label: release.name,
        avatar: {
          src: release.expand?.publisher
            ? $pb.files.getUrl(
                release.expand?.publisher,
                release.expand?.publisher.logo,
              )
            : "",
        },
      })),
  },
);

const schema = z.object({
  release: z.string().min(1, t("error.review.releaseInvalid")),
  user: z.string(),
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
  release: "",
  user: currentUser.value?.id,
  header: "",
  score: 0,
});

const content = useStorage("review-content", "");
const currentRelease = computed(
  () => releases.value?.find((release) => release.id === state.value.release),
);

const form = ref<Form<Schema>>();

const titleSelectOpen = ref(false);
const postPromptOpen = ref(false);

async function submit() {
  const data: Schema = await form.value!.validate();

  post({
    ...data,
    content: content.value,
  });
}

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <UContainer>
    <AppH1 class="mb-6">{{ $t("review.create") }}</AppH1>

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="flex flex-col-reverse gap-6 sm:flex-row"
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
            <UButton
              color="white"
              variant="solid"
              :label="title?.name || $t('review.titleSelect')"
              block
              @click="titleSelectOpen = true"
            />
          </UFormGroup>
          <UFormGroup :label="$t('review.release')" name="release">
            <USelectMenu
              v-model="state.release"
              :options="releases || []"
              :loading="releasesPending"
              :disabled="!releases || releases.length == 0"
              value-attribute="id"
              option-attribute="label"
            >
              <template #label>
                <span v-if="currentRelease">{{ currentRelease.label }}</span>
                <span v-else>{{ $t("review.releaseSelect") }}</span>
              </template>
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
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  /10
                </span>
              </template>
            </UInput>
          </UFormGroup>
          <UButton
            trailing-icon="i-fluent-send-20-filled"
            block
            @click="postPromptOpen = true"
          >
            {{ $t("review.post") }}
          </UButton>
        </div>
      </div>
    </UForm>

    <UModal v-model="postPromptOpen">
      <UCard>
        {{ $t("review.postPrompt") }}
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="red"
              variant="ghost"
              @click="postPromptOpen = false"
            >
              {{ $t("general.return") }}
            </UButton>
            <UButton :loading="pending" @click="submit">
              {{ $t("general.confirm") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <PageReviewTitleSelect v-model="titleSelectOpen" v-model:title="title" />
  </UContainer>
</template>
