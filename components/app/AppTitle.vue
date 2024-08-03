<script setup lang="ts">
import { joinURL } from "ufo";
import type { MetadataCommon, MetadataImages } from "@/types/common";
import type { TitlesResponse } from "@/types/pb";

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};

defineProps<{
  title: TitlesResponse<MetadataCommon>;
  src?: string;
  srcset?: MetadataImages;
}>();
</script>

<template>
  <NuxtLink :to="joinURL('/title/' + title.slug)" class="group space-y-3">
    <UCard :ui="ui">
      <AppBookCover
        class="transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name="title.name"
        :src="
          src ||
          (title.metadata?.images && !Array.isArray(title.metadata.images)
            ? title.metadata.images['1920w']
            : undefined)
        "
        :srcset="
          srcset ||
          (title.metadata?.images && !Array.isArray(title.metadata.images)
            ? title.metadata.images
            : undefined)
        "
        v-bind="$attrs"
      />
    </UCard>
    <div class="space-y-1">
      <slot name="before" />
      <h3
        class="decoration-primary-400 line-clamp-4 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ title.name }}
      </h3>

      <slot name="after" />
    </div>
  </NuxtLink>
</template>
