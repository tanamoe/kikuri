<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { data: recentReleases } = await useAsyncData(() => getRecentReleases());
const { data: recentBooks } = await useAsyncData(() => getRecentBooks(6));
const { data: recentPosts } = await useAsyncData(() => getRecentGhostPosts());
</script>

<template>
  <div class="space-y-24">
    <div class="overflow-y-hidden sm:h-fit">
      <UContainer>
        <PageIndexSwiper v-if="recentReleases" :data="recentReleases" />
      </UContainer>
    </div>

    <UContainer>
      <AppRegisterBanner />
    </UContainer>

    <div v-if="recentPosts">
      <UContainer class="mb-6">
        <NuxtLink :to="runtimeConfig.public.blog_url" target="_blank">
          <AppH3 class="flex items-center gap-3">
            <img src="/icon-blog.svg" class="h-6" />
            {{ $t("general.recentPosts") }}
          </AppH3>
        </NuxtLink>
      </UContainer>
      <div
        class="flex snap-x snap-mandatory gap-6 overflow-x-scroll sm:grid sm:grid-cols-3 sm:overflow-x-hidden sm:px-6"
      >
        <div
          v-for="(post, i) in recentPosts"
          :key="post.id"
          :class="[
            'w-5/6 flex-shrink-0 snap-center sm:w-full',
            i === 0 && 'ml-6 sm:ml-0',
            i === recentPosts.length - 1 && 'mr-6 sm:mr-0',
          ]"
        >
          <AppBlogPost :post="post" />
        </div>
      </div>
    </div>

    <div v-if="recentBooks">
      <UContainer class="mb-6">
        <NuxtLink to="/browse">
          <AppH3 class="flex items-center gap-3">
            <img src="/icon.svg" class="h-6" />
            {{ $t("general.justAddedManga") }}
          </AppH3>
        </NuxtLink>
      </UContainer>
      <div
        class="flex snap-x snap-mandatory gap-6 overflow-x-scroll sm:grid sm:grid-cols-3 sm:overflow-x-hidden sm:px-6 md:grid-cols-6"
      >
        <div
          v-for="(book, i) in recentBooks"
          :key="book.id"
          :class="[
            'w-1/3 flex-shrink-0 snap-start scroll-ml-6 sm:w-full',
            i === 0 && 'ml-6 sm:ml-0',
            i === recentBooks.length - 1 && 'mr-6 sm:mr-0',
          ]"
        >
          <AppBook :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>
