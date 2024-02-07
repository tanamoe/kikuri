<script setup lang="ts">
const store = useSettingsStore();

defineProps<{
  date: Date;
}>();
</script>

<template>
  <div
    v-if="store.display.datePosition === 'left'"
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
  </div>
  <div
    v-if="store.display.datePosition === 'top'"
    class="py-2 font-lexend text-2xl font-bold"
  >
    {{ $d(date, "full") }}
  </div>
</template>
