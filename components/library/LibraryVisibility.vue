<script setup lang="tsx">
import type { CollectionsVisibilityOptions } from "@/types/pb";

const { collectionVisibility } = useOptions();

const props = defineProps<{ visibility: CollectionsVisibilityOptions }>();

const v = computed(() =>
  collectionVisibility.value.find((v) => v.id === props.visibility),
);
</script>

<template>
  <div v-if="v">
    <h4>{{ $t("library.visibility") }}</h4>
    <UBadge color="neutral">
      {{ v.label }}
    </UBadge>
  </div>
</template>
