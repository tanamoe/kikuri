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
const { t } = useI18n({ useScope: "global" });

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
const advancedScoring = ref<boolean>(false);
const advancedScore = ref({
  story: 0,
  art: 0,
  translation: 0,
  print: 0,
});
const averageScore = computed(
  () =>
    (Number(advancedScore.value.story) +
      Number(advancedScore.value.art) +
      Number(advancedScore.value.translation) +
      Number(advancedScore.value.print)) /
    4,
);

const titleSelectOpen = ref(false);
const postPromptOpen = ref(false);

const advancedItems = computed(() => [
  {
    label: t("review.advancedScoring"),
    icon: "i-fluent-number-row-20-filled",
    defaultOpen: false,
    slot: "advanced-scoring",
  },
]);

function handlePost() {
  if (advancedScoring.value) {
    post({
      release: release.value?.id,
      user: currentUser.value?.id,
      header: header.value,
      content: content.value,
      detailedScoreStory: advancedScore.value.story,
      detailedScoreArt: advancedScore.value.art,
      detailedScoreTranslation: advancedScore.value.translation,
      detailedScorePrint: advancedScore.value.print,
    });
  } else {
    post({
      release: release.value?.id,
      user: currentUser.value?.id,
      header: header.value,
      content: content.value,
      score: score.value,
    });
  }
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

        <UAccordion :items="advancedItems" color="white">
          <template #advanced-scoring>
            <UFormGroup :label="$t('review.useAdvancedScoring')" class="mb-3">
              <UToggle v-model="advancedScoring" />
            </UFormGroup>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <UFormGroup :label="$t('review.scoreStory')">
                <UInput
                  v-model="advancedScore.story"
                  icon="i-fluent-number-symbol-20-filled"
                  type="number"
                  min="0"
                  max="10"
                  :disabled="!advancedScoring"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      /10
                    </span>
                  </template>
                </UInput>
              </UFormGroup>

              <UFormGroup :label="$t('review.scoreArt')">
                <UInput
                  v-model="advancedScore.art"
                  icon="i-fluent-number-symbol-20-filled"
                  type="number"
                  min="0"
                  max="10"
                  :disabled="!advancedScoring"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      /10
                    </span>
                  </template>
                </UInput>
              </UFormGroup>

              <UFormGroup :label="$t('review.scoreTranslation')">
                <UInput
                  v-model="advancedScore.translation"
                  icon="i-fluent-number-symbol-20-filled"
                  type="number"
                  min="0"
                  max="10"
                  :disabled="!advancedScoring"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      /10
                    </span>
                  </template>
                </UInput>
              </UFormGroup>

              <UFormGroup :label="$t('review.scorePrint')">
                <UInput
                  v-model="advancedScore.print"
                  icon="i-fluent-number-symbol-20-filled"
                  type="number"
                  min="0"
                  max="10"
                  :disabled="!advancedScoring"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      /10
                    </span>
                  </template>
                </UInput>
              </UFormGroup>
            </div>
          </template>
        </UAccordion>
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
              :value="advancedScoring ? averageScore : '0'"
              :disabled="advancedScoring"
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
