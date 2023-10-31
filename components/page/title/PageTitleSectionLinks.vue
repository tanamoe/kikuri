<script setup lang="ts">
import type { LinksResponse, LinkSourcesResponse } from "@/types/pb";

defineProps<{
  links: LinksResponse<{
    source: LinkSourcesResponse;
  }>[];
}>();
</script>

<template>
  <UButton
    v-for="link in links"
    :key="link.id"
    :to="link.url"
    target="_blank"
    color="gray"
    block
  >
    <template #leading>
      <img
        v-if="link.expand?.source"
        loading="lazy"
        class="h-4 w-auto"
        :src="
          $pb.files.getUrl(link.expand?.source, link.expand?.source.icon, {
            thumb: '50x50',
          })
        "
      />
    </template>
    <span v-if="link.expand?.source">
      {{ link.expand?.source.name }}
    </span>
  </UButton>
</template>
