<script setup lang="ts">
import type { PostOrPage } from "@tryghost/content-api";

const runtimeConfig = useRuntimeConfig();

defineProps<{
  post: PostOrPage;
}>();
</script>

<template>
  <NuxtLink
    :to="`${runtimeConfig.public.blog_url}/posts/${post.slug}`"
    target="_blank"
  >
    <AppCard>
      <img
        v-if="post.feature_image"
        class="aspect-[3/2] h-full w-full object-cover"
        loading="lazy"
        :src="post.feature_image"
      />
      <!-- TODO: replace by placeholder image -->
      <div
        v-else
        class="aspect-[3/2] h-full w-full rounded-lg bg-gray-300 dark:bg-gray-700"
      />
    </AppCard>
    <h3 class="mt-2 font-condensed text-xl">{{ post.title }}</h3>
    <div
      class="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
    >
      <div v-if="post.primary_author" class="flex items-center gap-2">
        <UAvatar
          v-if="post.primary_author.profile_image"
          :src="post.primary_author.profile_image"
          size="2xs"
        />
        <span>
          {{ post.primary_author.name }}
        </span>
      </div>
      &middot;
      <span v-if="post.created_at">
        {{ $d(new Date(post.created_at)) }}
      </span>
    </div>
  </NuxtLink>
</template>
