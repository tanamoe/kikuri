<script setup lang="ts">
import { joinURL } from "ufo";
import type { MetadataImages } from "@/types/common";
import type {
  AssetsResponse,
  FormatsResponse,
  TitlesResponse,
} from "@/types/pb";

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};

defineProps<{
  title: Pick<TitlesResponse, "name" | "slug">;
  format?: Pick<FormatsResponse, "name">;
  image?: AssetsResponse<MetadataImages>;
  sizes?: string;
  draggable?: boolean;
}>();
</script>

<template>
  <NuxtLink
    :to="joinURL('/title', title.slug)"
    class="group space-y-3"
    :draggable
  >
    <UCard :ui>
      <AppImageCover
        class="transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name="title.name"
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
      </div>

      <h3
        class="decoration-primary-400 line-clamp-4 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ title.name }}
      </h3>
    </div>
  </NuxtLink>
</template>
