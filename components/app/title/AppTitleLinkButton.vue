<script setup lang="ts">
import type { LinkSourcesResponse, LinksResponse } from "@/types/pb";

defineProps<{
  link: LinksResponse<{ source: LinkSourcesResponse }>;
}>();
</script>

<template>
  <UButton
    v-if="link.expand?.source"
    :to="link.url"
    target="_blank"
    color="neutral"
  >
    <img
      v-if="link.expand.source.icon"
      :src="
        $pb.files.getURL(link.expand.source, link.expand.source.icon, {
          thumb: '50x50',
        })
      "
      class="h-4 w-4 object-contain"
      :alt="link.expand.source.name"
    />
    {{ link.expand.source.name }}
  </UButton>
</template>
