<script setup lang="ts">
import { storeToRefs } from "pinia";
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

const { currentUser } = storeToRefs(store);

const { data: title } = await useAsyncData(
  () =>
    $pb
      .collection(Collections.Title)
      .getOne<TitleResponse>(route.query.title as string),
  {
    immediate: typeof route.query.title === "string",
    transform: (title) => structuredClone(title),
  },
);

const release = ref<ReleaseResponse>();
const { data: releases, pending: releasesPending } = await useAsyncData(
  () => {
    release.value = undefined;
    return $pb.collection(Collections.Release).getFullList<
      ReleaseResponse<{
        publisher: PublisherResponse;
      }>
    >({
      filter: `title = '${title.value?.id}'`,
      expand: "publisher",
      pick: "id,name,publisher",
    });
  },
  {
    watch: [title],
    transform: (releases) => {
      if (releases)
        return structuredClone(releases).map((release) => ({
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
        }));
    },
  },
);

const header = ref<string>();
const content = ref<string>("");
const score = ref<number>();

const titleSelectOpen = ref(false);
const postPromptOpen = ref(false);

function handlePost() {
  post({
    release: release.value?.id,
    user: currentUser.value?.id,
    header: header.value,
    content: content.value,
    score: score.value,
  });
}

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <UContainer>
    <AppH1 class="mb-6">{{ $t("review.create") }}</AppH1>

    <div class="flex flex-col-reverse gap-6 sm:flex-row">
      <div class="flex-1">
        <UAlert
          :title="$t('review.termsTitle')"
          :description="$t('review.termsDescription')"
          icon="i-fluent-document-endnote-20-filled"
          class="mb-6"
        />
        <UInput
          v-model="header"
          class="mb-6"
          :placeholder="$t('review.header')"
        />
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
          <UFormGroup :label="$t('review.release')">
            <USelectMenu
              v-model="release"
              :options="releases || []"
              :loading="releasesPending"
              :disabled="title === null"
              :placeholder="$t('review.releaseSelect')"
            />
          </UFormGroup>
          <UFormGroup :label="$t('review.score')">
            <UInput
              v-model="score"
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
    </div>

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
            <UButton :loading="pending" @click="handlePost">
              {{ $t("general.confirm") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <PageReviewTitleSelect v-model="titleSelectOpen" v-model:title="title" />
  </UContainer>
</template>
