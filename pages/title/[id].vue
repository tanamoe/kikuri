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
const { share, isSupported: shareSupported } = useShare();
const { copy, copied, isSupported: clipboardSupported } = useClipboard();
const toast = useToast();

const { data: title } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne<
    TitlesResponse<
      {},
      {
        format: FormatsResponse;
      }
    >
  >(route.params.id as string, {
    expand: "format",
  }),
);
if (!title.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

const { data: works } = await useAsyncData(() =>
  $pb.collection(Collections.Works).getFullList<
    WorksResponse<{
      staff: StaffsResponse;
    }>
  >({
    filter: `title = '${title.value!.id}'`,
    sort: "+priority",
    expand: "staff",
  }),
);

const { data: releases } = await useAsyncData(() =>
  $pb.collection(Collections.Releases).getFullList<
    ReleasesResponse<{
      publisher: PublishersResponse;
    }>
  >({
    filter: `title='${title.value!.id}'`,
    expand: "publisher",
  }),
);

const { data: reviews } = await useAsyncData(() =>
  $pb.collection(Collections.Reviews).getFullList<
    ReviewsResponse<{
      user: UsersResponse;
    }>
  >({
    filter: `release.title = '${title.value!.id}'`,
    expand: "user",
  }),
);

const { data: images } = await useAsyncData(() =>
  getTitleCoverImages(title.value!.id),
);

function startShare() {
  share({ title: title.value!.name, url: location.href });
}

function copyLink() {
  toast.add({
    color: "primary",
    title: t("general.copySuccess"),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  copy(location.href);
}

const ogImage = new URL("/title", runtimeConfig.public.ogUrl);
ogImage.searchParams.set("name", title.value.name);
ogImage.searchParams.set("format", title.value.expand!.format.name);
if (title.value.cover)
  ogImage.searchParams.set(
    "image",
    $pb.files.getUrl(title.value, title.value.cover),
  );

useSeoMeta({
  title: title.value.name,
  description: title.value.description.replace(/<[^>]*>/g, "").slice(0, 200),
  ogTitle: title.value.name,
  ogDescription: title.value.description.replace(/<[^>]*>/g, "").slice(0, 200),
  ogImage: ogImage.toString(),
  ogImageAlt: title.value.name,
});

definePageMeta({
  layout: "full",
});
</script>

<template>
  <UContainer v-if="title">
    <PageTitleHeader :title="title" />

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
          <UButton
            v-if="shareSupported"
            icon="i-fluent-share-ios-20-regular"
            color="gray"
            square
            @click="startShare"
          />
          <UButton
            v-else-if="clipboardSupported"
            :icon="
              copied
                ? 'i-fluent-checkmark-20-filled'
                : 'i-fluent-link-square-20-filled'
            "
            color="gray"
            square
            @click="copyLink"
          />
        </div>
        <PageTitleWorks v-if="works && works.length > 0" :works="works" />
        <UButton
          :to="`/review/create?title=${title.id}`"
          color="gray"
          icon="i-fluent-pen-20-filled"
          block
          >{{ $t("review.create") }}</UButton
        >
      </div>
    </div>
  </UContainer>
</template>
