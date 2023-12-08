<script setup lang="ts">
import { type UserCollectionsResponse } from "@/types/collections";

const { status } = useLibraryStatus();

const props = defineProps<{
  collections: UserCollectionsResponse;
}>();

const c = computed(() =>
  props.collections.items.map((item) => ({
    label: item.collection?.name || "",
    to: item.collection?.id,
  })),
);

const s = computed(() =>
  status.value.map((s) => ({
    ...s,
    to: `#${s.id}`,
    external: true,
  })),
);
</script>

<template>
  <div class="space-y-3">
    <UVerticalNavigation :links="c" />

    <UDivider />

    <UVerticalNavigation :links="s" />
  </div>
</template>
