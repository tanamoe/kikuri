<script setup lang="ts">
import {
  Collections,
  type ReleaseDetailsResponse,
  type FormatsResponse,
  type TitlesResponse,
  type PublishersResponse,
} from "@/types/pb";
import type { MetadataCommon } from "~/types/common";

type ResponseType = ReleaseDetailsResponse<
  MetadataCommon,
  {
    title: TitlesResponse<
      unknown,
      {
        format: FormatsResponse;
      }
    >;
    publisher: PublishersResponse;
  }
>;

const { $pb } = useNuxtApp();

const { data: releases } = await useLazyAsyncData(() =>
  $pb.collection(Collections.ReleaseDetails).getList<ResponseType>(1, 6, {
    expand: "title,title.format,publisher",
    sort: "-updated",
  }),
);
</script>

<template>
  <div v-if="releases">
    <UContainer class="mb-6">
      <NuxtLink to="/browse">
        <AppH3
          class="flex items-center gap-3 underline decoration-tanablue-400 decoration-[.2rem] underline-offset-[.2rem]"
        >
          <img src="/icon.svg" class="h-6" />
          {{ $t("general.justUpdatedReleases") }}
        </AppH3>
      </NuxtLink>
    </UContainer>
    <div
      v-if="releases"
      class="flex snap-x snap-mandatory gap-6 overflow-x-scroll sm:grid sm:grid-cols-3 sm:overflow-x-hidden sm:px-6 md:grid-cols-6"
    >
      <div
        v-for="(release, i) in releases.items"
        :key="release.id"
        :class="[
          'w-1/3 flex-shrink-0 snap-start scroll-ml-6 sm:w-full',
          i === 0 && 'ml-6 sm:ml-0',
          i === releases.items.length - 1 && 'mr-6 sm:mr-0',
        ]"
      >
        <AppRelease
          :release="release"
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
        />
      </div>
    </div>
  </div>
</template>
