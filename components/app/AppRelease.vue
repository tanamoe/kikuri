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

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
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
        :src="image && $pb.files.getUrl(image, image.image)"
        :srcset="image && image.resizedImage"
        :sizes
        :draggable
      />
    </UCard>
    <div class="space-y-1">
      <div class="flex flex-wrap items-center gap-1">
        <UBadge v-if="format" color="gray">
          {{ format.name }}
        </UBadge>
        <UBadge v-if="release.digital" color="red">Digital</UBadge>
        <UBadge v-if="partner" color="gray">
          <AppPublisher :publisher="partner" />
        </UBadge>
        <UBadge v-if="publisher" color="gray">
          <AppPublisher :publisher />
        </UBadge>
      </div>

      <h3
        class="decoration-primary-400 line-clamp-4 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ release.name }}
      </h3>

      <div v-if="release.disambiguation">{{ release.disambiguation }}</div>
    </div>
  </NuxtLink>
</template>
