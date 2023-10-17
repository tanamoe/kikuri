<script setup lang="ts">
/* eslint-disable vue/no-v-html */
import {
  Collections,
  type UsersResponse,
  type TitlesResponse,
  type FormatsResponse,
  type WorksResponse,
  type StaffsResponse,
  type ReleasesResponse,
  type PublishersResponse,
  type ReviewsResponse,
} from "@/types/pb";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { data } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne<
    TitlesResponse<
      {},
      {
        "works(title)": WorksResponse<{
          staff: StaffsResponse;
        }>[];
        "releases(title)": ReleasesResponse<{
          publisher: PublishersResponse;
        }>[];
        format: FormatsResponse;
      }
    >
  >(route.params.id as string, {
    expand: "works(title).staff,releases(title).publisher,format",
  }),
);

const releases = computed(() => data.value?.expand?.["releases(title)"]);
const works = computed(() => data.value?.expand?.["works(title)"]);

if (!data.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

const { data: reviews } = await useLazyAsyncData(() =>
  $pb.collection(Collections.Reviews).getFullList<
    ReviewsResponse<{
      user: UsersResponse;
    }>
  >({
    filter: `release.title = '${data.value!.id}'`,
    expand: "user",
  }),
);

const { data: images } = await useLazyAsyncData(() =>
  getTitleCoverImages(data.value!.id),
);

const ogImage = new URL("/title", runtimeConfig.public.ogUrl);
ogImage.searchParams.set("name", data.value.name);
ogImage.searchParams.set("format", data.value.expand!.format.name);
if (data.value.cover)
  ogImage.searchParams.set(
    "image",
    $pb.files.getUrl(data.value, data.value.cover),
  );

useSeoMeta({
  title: data.value.name,
  description: data.value.description.replace(/<[^>]*>/g, "").slice(0, 200),
  ogTitle: data.value.name,
  ogDescription: data.value.description.replace(/<[^>]*>/g, "").slice(0, 200),
  ogImage: ogImage.toString(),
  ogImageAlt: data.value.name,
});

definePageMeta({
  layout: "full",
});
</script>

<template>
  <UContainer v-if="data">
    <PageTitleHeader :title="data" />

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <div v-if="releases && releases.length > 0">
          <AppH3 class="mb-3 mt-12">{{ $t("general.releaseCalendar") }}</AppH3>
          <PageTitleReleases :releases="releases" />
        </div>

        <div v-if="reviews && reviews.length > 0">
          <AppH3 class="mb-3 mt-12">{{ $t("general.review") }}</AppH3>
          <PageTitleReviews :reviews="reviews" />
        </div>

        <div v-if="images && images.length > 0">
          <AppH3 class="mb-3 mt-12">{{ $t("general.coverImages") }}</AppH3>
          <PageTitleCoverImages :images="images" />
        </div>
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64">
        <div class="flex gap-3">
          <UButton class="flex-1" block disabled>
            {{ $t("general.follow") }}
          </UButton>
          <AppShareButton :title="data.name" />
        </div>

        <PageTitleWorks v-if="works && works.length > 0" :works="works" />

        <UButton
          :to="`/review/create?title=${data.id}`"
          color="gray"
          icon="i-fluent-pen-20-filled"
          block
        >
          {{ $t("review.create") }}
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
