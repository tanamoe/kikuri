<script setup lang="ts">
defineProps<{
  date: Date;
}>();
</script>

<template>
  <div class="text-center text-xs leading-none md:text-sm">
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
</template>
