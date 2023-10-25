<script setup lang="ts">
import { z } from "zod";
import { useStorage } from "@vueuse/core";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import {
  Collections,
  type UsersResponse,
  type ReviewsResponse,
} from "@/types/pb";

const route = useRoute();
const { $pb } = useNuxtApp();
const { pending, edit, remove } = useReview();
const { t } = useI18n({ useScope: "global" });

if (typeof route.query.id !== "string" || !route.query.id) {
  await navigateTo("/");
}

const { data: review } = await useAsyncData(() =>
  $pb
    .collection(Collections.Reviews)
    .getOne<ReviewsResponse>(route.query.id as string),
);

if (!review.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

if (review.value.user !== ($pb.authStore.model as UsersResponse)?.id)
  throw createError({
    statusCode: 401,
    statusMessage: t("error.unauthorizedMessage"),
  });

const schema = z.object({
  id: z.string(),
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
  id: review.value.id,
  header: review.value.header,
  score: review.value.score,
});

const content = useStorage(
  `review-content-${review.value.id}`,
  review.value.content,
);

const editPromptOpen = ref(false);
const removePromptOpen = ref(false);

async function submit(event: FormSubmitEvent<Schema>) {
  await edit(review.value!.id, {
    ...event.data,
    content: content.value,
  });
}

definePageMeta({
  middleware: "with-auth",
});
</script>

<template>
  <UContainer>
    <AppH1 class="mb-6">{{ $t("review.edit") }}</AppH1>

    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col-reverse gap-6 sm:flex-row"
    >
      <div class="flex-1">
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
          <div class="flex max-w-full gap-3">
            <UButton
              class="flex flex-1 items-center justify-center"
              trailing-icon="i-fluent-edit-20-filled"
              @click="editPromptOpen = true"
            >
              {{ $t("review.action.edit") }}
            </UButton>
            <UButton
              icon="i-fluent-delete-20-filled"
              color="red"
              variant="ghost"
              square
              @click="removePromptOpen = true"
            />
          </div>
        </div>
      </div>
    </UForm>

    <UModal v-model="editPromptOpen">
      <UCard>
        {{ $t("review.editPrompt") }}
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="red"
              variant="ghost"
              @click="editPromptOpen = false"
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

    <UModal v-model="removePromptOpen">
      <UCard>
        {{ $t("review.removePrompt") }}
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="red"
              variant="ghost"
              @click="removePromptOpen = false"
            >
              {{ $t("general.return") }}
            </UButton>
            <UButton :loading="pending" @click="remove(review!.id)">
              {{ $t("general.confirm") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>
