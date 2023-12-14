<script setup lang="ts">
/* eslint-disable vue/no-v-html */
import {
  Collections,
  type CollectionsResponse,
  type ReleasesResponse,
  type ReviewsResponse,
  type TitlesResponse,
  type UsersResponse,
} from "@/types/pb";
import { type UserCollectionsResponse } from "@/types/collections";

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

const { data: reviews } = await useAsyncData(() =>
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

const { data: collections } = await useAsyncData(() => {
  return $pb.send<UserCollectionsResponse>(
    `/api/user-collections/${user.value?.id}`,
    {
      method: "GET",
      expand: "collection",
    },
  );
});

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

const ui = {
  wrapper: "space-y-6",
};

useSeoMeta({
  title: user.value.displayName || user.value.username,
  description: user.value.bio.replace(/<[^>]*>/g, "").slice(0, 200),
  ogTitle: user.value.displayName || user.value.username,
  ogDescription: user.value.bio.replace(/<[^>]*>/g, "").slice(0, 200),
});
</script>

<template>
  <div v-if="user" class="flex flex-col gap-6 md:flex-row">
    <AppUserProfile
      class="h-min w-full rounded-md bg-gray-200 dark:bg-gray-800 md:max-w-xs"
      :user="user"
    />
    <UTabs :items="items" :ui="ui" class="w-full flex-1">
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
          class="prose prose-sm max-w-none text-center dark:prose-invert"
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
          class="prose prose-sm max-w-none text-center dark:prose-invert"
        >
          <h4>(╥﹏╥)</h4>
          <h3>{{ $t("review.noReview") }}</h3>
        </div>
      </template>
    </UTabs>
  </div>
</template>