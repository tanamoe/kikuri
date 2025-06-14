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
const { ogUrl } = useRuntimeConfig().public;
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

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
if (!review.value.expand?.user || !review.value.expand.release.expand?.title)
  throw createError({ statusCode: 500 });

const links = computed(() => {
  if (!review.value?.expand?.release.expand?.title) return [];

  return [
    {
      label: review.value.expand.release.expand.title.name,
      to: joinURL("/title", review.value?.expand?.release.expand?.title.slug),
    },
    {
      label: review.value.expand.release.name,
    },
    {
      label: t("general.review"),
    },
  ];
});

const ogImage = computed(() => {
  if (review.value) {
    const url = new URL("/review", ogUrl);
    url.searchParams.set("title", review.value.header);

    if (review.value.expand?.user) {
      const user = review.value.expand.user;
      url.searchParams.set("user", user.displayName || user.username);
      if (user.avatar) {
        url.searchParams.set(
          "avatar",
          $pb.files.getURL(user, user.avatar, { thumb: "32x32" }),
        );
      }
    }

    if (description.value) {
      url.searchParams.set("description", description.value);
    }

    if (review.value.expand?.release.expand?.title) {
      const title = review.value.expand.release.expand.title;
      url.searchParams.set("name", title.name);
      if (title.cover)
        url.searchParams.set("image", $pb.files.getURL(title, title.cover));
    }

    return url;
  }

  return null;
});

const description = computed(() => {
  if (review.value?.content) {
    const content = review.value.content.replace(/<[^>]*>/g, "");

    if (content.length > 250) {
      return content.slice(0, 250) + "…";
    }

    return content;
  }

  return null;
});

useSeoMeta({
  title: t("seo.reviewTitle", {
    title: review.value.expand.release.expand.title.name,
    user:
      review.value.expand.user.displayName || review.value.expand.user.username,
  }),
  description: description.value,
  author:
    review.value.expand.user.displayName || review.value.expand.user.username,
  ogTitle: t("seo.reviewTitle", {
    title: review.value.expand.release.expand.title.name,
    user:
      review.value.expand.user.displayName || review.value.expand.user.username,
  }),
  ogDescription: description.value,
  ogImage: ogImage.value?.toString(),
});
</script>

<template>
  <div v-if="review">
    <article class="prose dark:prose-invert prose-img:mx-auto mx-auto">
      <UBreadcrumb class="not-prose mb-3" :links="links" />

      <AppH1 class="mb-6">{{ review.header }}</AppH1>

      <div class="flex items-center justify-between gap-3">
        <div v-if="review.expand?.user" class="flex items-center gap-3">
          <UAvatar
            :src="
              $pb.files.getURL(review.expand.user, review.expand.user.avatar, {
                thumb: '32x32',
              })
            "
            :alt="review.expand.user.displayName || review.expand.user.username"
          />
          <ULink :to="joinURL('/user', review.expand.user.username)">
            {{ review.expand.user.displayName || review.expand.user.username }}
          </ULink>
        </div>
        <div
          v-if="review.user == $pb.authStore.record?.id"
          class="flex items-center gap-3"
        >
          <UButton
            trailing-icon="i-fluent-edit-20-filled"
            color="neutral"
            variant="link"
            :to="'/review/edit?id=' + review.id"
          >
            {{ $t("review.edit") }}
          </UButton>
        </div>
      </div>

      <div v-html="review.content" />

      <UDivider />

      <div class="mt-6 text-center">
        <UBadge class="text-bold font-condensed px-2.5 py-1.5 text-3xl">
          {{ review.score }}/10
        </UBadge>
      </div>
    </article>
  </div>
</template>
