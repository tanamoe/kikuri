<script setup lang="ts">
import type { PostsOrPages } from "@tryghost/content-api";

const {
  public: { blogUrl },
} = useRuntimeConfig();

const { data: posts } = await useFetch<PostsOrPages>(`${blogUrl}/api/home`);
</script>

<template>
  <div v-if="posts">
    <UContainer class="mb-6">
      <NuxtLink :to="blogUrl" target="_blank">
        <AppH3
          class="flex items-center gap-3 underline decoration-tanaamber-400 decoration-[.2rem] underline-offset-[.2rem]"
        >
          <img src="/icon-blog.svg" class="h-6" />
          {{ $t("general.recentPosts") }}
        </AppH3>
      </NuxtLink>
    </UContainer>
    <div
      class="flex snap-x snap-mandatory gap-6 overflow-x-scroll sm:grid sm:grid-cols-3 sm:overflow-x-hidden sm:px-6"
    >
      <div
        v-for="(post, i) in posts"
        :key="post.id"
        :class="[
          'w-5/6 flex-shrink-0 snap-center sm:w-full',
          i === 0 && 'ml-6 sm:ml-0',
          i === posts.length - 1 && 'mr-6 sm:mr-0',
        ]"
      >
        <AppBlogPost :post="post" />
      </div>
    </div>
  </div>
</template>
