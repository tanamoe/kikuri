<script setup lang="ts">
// TODO: replace /browse links with proper pages, etc.
import { withQuery } from "ufo";
import type {
  WorksResponse,
  StaffsResponse,
  GenresResponse,
  DemographicsResponse,
} from "@/types/pb";

defineProps<{
  demographic?: DemographicsResponse;
  genres?: GenresResponse[];
  works:
    | WorksResponse<{
        staff: StaffsResponse;
      }>[]
    | null;
}>();
</script>

<template>
  <UCard
    v-if="works || genres"
    class="prose prose-sm max-w-none dark:prose-invert prose-h4:my-0 prose-a:text-gray-800 prose-a:no-underline hover:prose-a:text-tanablue-500 hover:prose-a:underline prose-hr:my-3 dark:prose-a:text-gray-300 dark:hover:prose-a:text-tanablue-400"
    :ui="{
      body: {
        base: 'divide-y divide-gray-200 dark:divide-gray-800',
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <div v-if="demographic" class="p-4 sm:p-4">
      <h4 class="font-bold">{{ $t("general.demographic") }}</h4>
      <ULink
        :to="withQuery('/browse', { demographic: demographic.slug })"
        :external="true"
      >
        <UBadge class="mr-1.5 mt-1.5" color="gray">
          {{ demographic.name }}
        </UBadge>
      </ULink>
    </div>
    <div v-if="genres && genres.length > 0" class="p-4 sm:p-4">
      <h4 class="font-bold">{{ $t("general.genres") }}</h4>
      <ULink
        v-for="genre in genres"
        :key="genre.id"
        :to="withQuery('/browse', { genre: genre.slug })"
        :external="true"
      >
        <UBadge class="mr-1.5 mt-1.5" color="gray">
          {{ genre.name }}
        </UBadge>
      </ULink>
    </div>
    <div v-if="works && works.length > 0" class="space-y-3 p-4 sm:p-4">
      <div v-for="work in works" :key="work.id">
        <h4 class="font-bold">{{ work.name }}</h4>
        <ULink :to="'/staff/' + work.staff">
          {{ work.expand!.staff.name }}
        </ULink>
      </div>
    </div>
  </UCard>
</template>
