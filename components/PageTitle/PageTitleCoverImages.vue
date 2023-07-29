<script setup lang="ts">
const props = defineProps<{
  titleId: string;
}>();

const releases = await useTitleCoverImages(props.titleId);
</script>

<template>
  <div
    v-if="releases"
    class="grid grid-cols-2 gap-6 sm:grid-cols-4 xl:grid-cols-6"
  >
    <template v-for="release in releases" :key="release.id">
      <AppCard v-for="cover in release.cover" :key="cover">
        <nuxt-img
          loading="lazy"
          class="aspect-[2/3] h-full w-full object-cover"
          :src="usePocketbaseImage(release, cover)"
        />
      </AppCard>
    </template>
  </div>
</template>
