<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const store = useSettingsStore();
const { datePosition } = storeToRefs(store);

defineProps<{
  date: Date;
}>();
</script>

<template>
  <div
    v-if="datePosition === 'left'"
    class="text-center text-xs leading-none md:text-sm"
  >
    <div class="overflow-hidden text-ellipsis whitespace-nowrap">
      {{ $d(date, "weekdayShort") }}
    </div>
    <div class="font-lexend text-4xl font-bold md:text-5xl">
      <span>
        {{ $d(date, "twoDigitDay") }}
      </span>
      <br />
      <span>
        {{ $d(date, "twoDigitMonth") }}
      </span>
    </div>
    <div class="mt-3 flex"></div>
  </div>
  <div
    v-if="datePosition === 'top'"
    class="py-3 font-lexend text-2xl font-bold"
  >
    {{ $d(date, "full") }}
  </div>
</template>
