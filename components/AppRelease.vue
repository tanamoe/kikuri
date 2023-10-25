<script setup lang="ts">
import { joinURL } from "ufo";
import type { ReleasesResponse, TitlesResponse } from "@/types/pb";

defineProps<{
  release: ReleasesResponse<{
    title: TitlesResponse;
  }>;
  sizes?: string;
}>();
</script>

<template>
  <NuxtLink
    v-if="release.expand?.title"
    :to="joinURL('/title/' + release.title)"
    class="group"
  >
    <AppCard>
      <AppCover
        :record="release.expand.title"
        :file-name="release.expand.title.cover"
        :sizes="sizes"
      />
    </AppCard>
    <div class="mt-2">
      <span
        class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ release.expand.title.name }}
      </span>
    </div>
  </NuxtLink>
</template>
