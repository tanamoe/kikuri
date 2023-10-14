<script setup lang="ts">
import type { WorksResponse, StaffsResponse } from "@/types/pb";

defineProps<{
  works: WorksResponse<{
    staff: StaffsResponse;
  }>[];
}>();
</script>

<template>
  <UCard
    class="prose prose-sm dark:prose-invert prose-a:text-gray-800 prose-a:no-underline hover:prose-a:text-tanablue-500 hover:prose-a:underline dark:prose-a:text-gray-300 dark:hover:prose-a:text-tanablue-400"
    :ui="{
      body: {
        base: 'space-y-3',
        padding: 'sm:p-4 px-4 py-3',
      },
    }"
  >
    <div v-for="work in works" :key="work.id">
      <div class="font-bold">{{ work.name }}</div>
      <ULink :to="'/staff/' + work.staff">
        {{ work.expand!.staff.name }}
      </ULink>
    </div>
  </UCard>
</template>
