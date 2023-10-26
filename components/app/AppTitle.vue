<script setup lang="ts">
import { joinURL } from "ufo";
import type { TitlesResponse } from "@/types/pb";

defineProps<{
  title: TitlesResponse;
  sizes?: string;
}>();
</script>

<template>
  <NuxtLink :to="joinURL('/title/' + title.id)" class="group">
    <AppCard>
      <AppCover :record="title" :file-name="title.cover" :sizes="sizes" />
    </AppCard>
    <div class="mt-2">
      <span
        class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ title.name }}
      </span>
    </div>
  </NuxtLink>
</template>
