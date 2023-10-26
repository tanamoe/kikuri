<script setup lang="ts">
/* eslint-disable vue/no-v-html */
import { joinURL } from "ufo";
import {
  Collections,
  type UsersResponse,
  type ReleasesResponse,
  type ReviewsResponse,
  type TitlesResponse,
} from "@/types/pb";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { currentUser } = useAuthentication();

const { data: review } = await useAsyncData(() =>
  $pb.collection(Collections.Reviews).getOne<
    ReviewsResponse<{
      user: UsersResponse;
      release: ReleasesResponse<{
        title: TitlesResponse;
      }>;
    }>
  >(route.params.id as string, {
    expand: "release.title,user",
  }),
);

if (!review.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });
if (!review.value.expand || !review.value.expand.release.expand)
  throw createError({ statusCode: 500 });

useSeoMeta({
  title: t("seo.reviewTitle", {
    user: review.value.expand.user.displayName,
    title: review.value.expand.release.expand.title.name,
  }),
  description: review.value.content.replace(/<[^>]*>/g, "").slice(0, 200),
  ogTitle: t("seo.reviewTitle", {
    user: review.value.expand.user.displayName,
    title: review.value.expand.release.expand.title.name,
  }),
  ogDescription: review.value.content.replace(/<[^>]*>/g, "").slice(0, 200),
  ogImage: runtimeConfig.public.ogUrl,
});
</script>

<template>
  <UContainer v-if="review">
    <article class="prose mx-auto dark:prose-invert prose-img:mx-auto">
      <nav class="chevron not-prose mb-3">
        <ol role="list">
          <li class="p-0">
            <UButton
              to="/"
              icon="i-fluent-home-20-filled"
              color="gray"
              variant="link"
              square
            />
            <UIcon name="i-fluent-slash-forward-20-filled" />
          </li>
          <li class="p-0">
            <UButton
              :to="joinURL('/title', review.expand!.release.title!)"
              color="gray"
              variant="link"
            >
              {{ review.expand!.release.expand!.title.name }}
            </UButton>
            <UIcon name="i-fluent-slash-forward-20-filled" />
          </li>
          <li class="p-0">
            <UButton color="gray" variant="link">
              {{ $t("general.review") }}
            </UButton>
          </li>
        </ol>
      </nav>

      <AppH1 class="mb-6">{{ review.header }}</AppH1>

      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="
              $pb.files.getUrl(
                review.expand!.user,
                review.expand!.user.avatar,
                { thumb: '100x100' },
              )
            "
            :alt="review.expand!.user.displayName"
          />
          <ULink :to="joinURL('/profile', review.user)">
            {{ review.expand!.user.displayName }}
          </ULink>
        </div>
        <div
          v-if="review.user == currentUser?.id"
          class="flex items-center gap-3"
        >
          <UButton
            trailing-icon="i-fluent-edit-20-filled"
            color="gray"
            variant="link"
            :to="'/review/edit?id=' + review.id"
          >
            {{ $t("review.edit") }}
          </UButton>
        </div>
      </div>

      <div v-html="review.content" />

      <hr />

      <div class="mt-6 text-center">
        <UBadge
          :ui="{
            size: { md: 'font-condensed text-bold text-3xl px-2.5 py-1.5' },
          }"
        >
          {{ review.score }}/10
        </UBadge>
      </div>
    </article>
  </UContainer>
</template>

<style scoped>
.chevron ol {
  @apply flex list-none items-center p-0;
}

.chevron li {
  @apply flex items-center;
}
</style>
