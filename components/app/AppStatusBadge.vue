<script setup lang="ts">
import type { ReleasesStatusOptions } from "~/types/pb";

const { releaseStatus } = useOptions();

const props = defineProps<{
  status: ReleasesStatusOptions;
}>();

const rs = computed(() =>
  releaseStatus.value.find((s) => s.id === props.status),
);
</script>

<template>
  <UBadge v-if="rs" :color="rs.color">
    {{ rs.label }}
  </UBadge>
</template>
