<script setup lang="ts">
import type {
  FormatsResponse,
  TitlesResponse,
  PublishersResponse,
  ReleasesResponse,
  AssetsResponse,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";
import { joinURL } from "ufo";
import type { CardProps } from "@nuxt/ui";

defineProps<{
  release: Pick<ReleasesResponse, "id" | "name" | "disambiguation" | "digital">;
  title: Pick<TitlesResponse, "slug">;
  image?: AssetsResponse<MetadataImages>;
  format?: Pick<FormatsResponse, "name">;
  publisher?: Pick<PublishersResponse, "collectionId" | "id" | "name" | "logo">;
  partner?: Pick<PublishersResponse, "collectionId" | "id" | "name" | "logo">;
  sizes?: string;
  draggable?: boolean;
}>();

const ui: CardProps["ui"] = {
  root: "relative overflow-hidden",
  body: "p-0 sm:p-0",
};
</script>

<template>
  <NuxtLink
    :to="joinURL('/title', title.slug, release.id)"
    class="group space-y-3"
    :draggable
  >
    <UCard :ui>
      <AppImageCover
        class="transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name="release.name"
        :src="image && $pb.files.getURL(image, image.image)"
        :srcset="image && image.resizedImage"
        :sizes
        :draggable
      />
    </UCard>
    <div class="space-y-1">
      <div
        v-if="format || release.digital || partner || publisher"
        class="flex flex-wrap items-center gap-1"
      >
        <UBadge v-if="format" color="neutral">
          {{ format.name }}
        </UBadge>
        <UBadge v-if="release.digital" color="error">Digital</UBadge>
        <UBadge v-if="partner" color="neutral">
          <AppPublisher :publisher="partner" />
        </UBadge>
        <UBadge v-if="publisher" color="neutral">
          <AppPublisher :publisher />
        </UBadge>
      </div>

      <h3
        class="decoration-primary-400 font-condensed line-clamp-4 text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ release.name }}
      </h3>

      <div v-if="release.disambiguation">{{ release.disambiguation }}</div>
    </div>
  </NuxtLink>
</template>
