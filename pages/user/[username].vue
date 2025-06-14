<script setup lang="ts">
import {
  Collections,
  type CollectionsResponse,
  type ReleasesResponse,
  type ReviewsResponse,
  type TitlesResponse,
  type UsersResponse,
} from "@/types/pb";
import type { UserCollectionsResponse } from "@/types/api/collections";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data: user } = await useAsyncData(() =>
  $pb.collection(Collections.Users).getFirstListItem<
    UsersResponse<{
      "collections(owner)": CollectionsResponse[];
    }>
  >(`username='${route.params.username}'`, {
    expand: "collections(owner)",
  }),
);
if (!user.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

const { data: reviews } = await useLazyAsyncData(() =>
  $pb.collection(Collections.Reviews).getFullList<
    ReviewsResponse<{
      release: ReleasesResponse<{
        title: TitlesResponse;
      }>;
    }>
  >({
    filter: $pb.filter("user = {:user}", { user: user.value?.id }),
    expand: "release.title",
    fields: "*,content:excerpt(200,true)",
  }),
);

const { data: collections } = await useAsyncData(() =>
  $pb.send<UserCollectionsResponse>(`/api/user-collections/${user.value?.id}`, {
    method: "GET",
    expand: "collection",
  }),
);

const items = computed(() => [
  {
    slot: "collections",
    label: t("library.collection"),
  },
  {
    slot: "reviews",
    label: t("general.review"),
  },
]);

const description = computed(() => {
  if (user.value?.bio) {
    const bio = user.value.bio.replace(/<[^>]*>/g, "");

    if (bio.length > 250) {
      return bio.slice(0, 250) + "…";
    }

    return bio;
  }

  return null;
});

useSeoMeta({
  title: user.value.displayName || user.value.username,
  description: description.value,
  ogTitle: user.value.displayName || user.value.username,
  ogDescription: description.value,
  ogImage: user.value.avatar
    ? $pb.files.getURL(user.value, user.value.avatar)
    : undefined,
  twitterCard: null,
});
</script>

<template>
  <div v-if="user" class="flex flex-col gap-6 md:flex-row">
    <AppUserProfile
      class="h-min w-full rounded-md bg-neutral-200 md:max-w-xs dark:bg-neutral-800"
      :user="user"
    />
    <UTabs :items="items" class="w-full flex-1">
      <template #collections>
        <div
          v-if="collections && collections.items.length > 0"
          class="space-y-6"
        >
          <template
            v-for="collection in collections.items"
            :key="collection.id"
          >
            <AppCollection
              v-if="collection.collection"
              :collection="collection.collection"
            />
          </template>
        </div>
        <div
          v-else
          class="prose prose-sm dark:prose-invert max-w-none text-center"
        >
          <h4>(╥﹏╥)</h4>
          <h3>{{ $t("library.noCollection") }}</h3>
        </div>
      </template>
      <template #reviews>
        <div
          v-if="reviews && reviews.length > 0"
          class="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <AppReview
            v-for="review in reviews"
            :key="review.id"
            :review="review"
            :release="review.expand?.release"
          />
        </div>
        <div
          v-else
          class="prose prose-sm dark:prose-invert max-w-none text-center"
        >
          <h4>(╥﹏╥)</h4>
          <h3>{{ $t("review.noReview") }}</h3>
        </div>
      </template>
    </UTabs>
  </div>
</template>
