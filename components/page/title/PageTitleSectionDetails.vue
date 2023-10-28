<script setup lang="ts">
import type { WorksResponse, StaffsResponse, GenresResponse } from "@/types/pb";

defineProps<{
  works?: WorksResponse<{
    staff: StaffsResponse;
  }>[];
  genres?: GenresResponse[];
}>();
</script>

<template>
  <UCard
    v-if="works || genres"
    class="prose prose-sm dark:prose-invert prose-h4:my-0 prose-a:text-gray-800 prose-a:no-underline hover:prose-a:text-tanablue-500 hover:prose-a:underline prose-hr:my-3 dark:prose-a:text-gray-300 dark:hover:prose-a:text-tanablue-400"
    :ui="{
      body: {
        padding: 'sm:p-4 px-4 py-3',
      },
    }"
  >
    <div v-if="genres && genres.length > 0">
      <h4 class="font-bold">{{ $t("general.genres") }}</h4>
      <UBadge
        v-for="genre in genres"
        :key="genre.id"
        class="mr-1.5 mt-1.5"
        color="gray"
      >
        {{ genre.name }}
      </UBadge>
      <hr class="border-gray-200 dark:border-gray-800" />
    </div>
    <div v-if="works && works.length > 0" class="space-y-3">
      <div v-for="work in works" :key="work.id">
        <h4 class="font-bold">{{ work.name }}</h4>
        <ULink :to="'/staff/' + work.staff">
          {{ work.expand!.staff.name }}
        </ULink>
      </div>
    </div>
  </UCard>
</template>
