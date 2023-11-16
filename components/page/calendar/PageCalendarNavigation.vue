<script setup lang="ts">
import type { Dayjs } from "dayjs";

defineProps<{
  month: Dayjs;
}>();

defineEmits<{
  "update:month": [month: Dayjs];
}>();
</script>

<template>
  <UContainer class="flex items-center justify-between">
    <UButton
      icon="i-fluent-arrow-left-20-filled"
      color="gray"
      @click="$emit('update:month', month.subtract(1, 'month'))"
    >
      {{ $t("general.monthPrevious") }}
    </UButton>
    <UButton
      trailing-icon="i-fluent-arrow-right-20-filled"
      color="gray"
      @click="$emit('update:month', month.add(1, 'month'))"
    >
      {{ $t("general.monthAfter") }}
    </UButton>
  </UContainer>
</template>
