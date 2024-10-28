<script setup lang="ts">
import type { PublishersResponse } from "@/types/pb";

defineProps<{
  publisher: PublishersResponse;
}>();
</script>

<template>
  <div class="flex items-center gap-1">
    <img
      v-if="publisher.logo"
      :src="$pb.files.getUrl(publisher, publisher.logo, { thumb: '24x24' })"
      class="h-4 w-4 object-contain"
      :alt="publisher.name"
    />
    {{ publisher.name }}
  </div>
</template>
