<script setup lang="ts">
// TODO: replace /browse links with proper pages, etc.
import { joinURL, withQuery } from "ufo";
import type {
  WorksResponse,
  StaffsResponse,
  GenresResponse,
  DemographicsResponse,
  AdditionalTitleNamesResponse,
} from "@/types/pb";

defineProps<{
  demographic?: DemographicsResponse;
  genres?: GenresResponse[];
  works?: WorksResponse<{
    staff: StaffsResponse;
  }>[];
  additionalNames?: AdditionalTitleNamesResponse[];
}>();
</script>

<template>
  <UCard
    v-if="works || genres"
    class="prose prose-sm dark:prose-invert prose-h4:my-0 prose-a:text-neutral-800 prose-a:no-underline hover:prose-a:text-tanablue-500 hover:prose-a:underline prose-hr:my-3 dark:prose-a:text-neutral-400 dark:hover:prose-a:text-tanablue-400 max-w-none"
    :ui="{
      body: 'divide-y divide-neutral-200 dark:divide-neutral-800 p-0 sm:p-0',
    }"
  >
    <div v-if="demographic" class="p-4 sm:p-4">
      <h4>{{ $t("general.demographic") }}</h4>
      <ULink :to="withQuery('/browse/titles', { demographic: demographic.id })">
        <UBadge class="mt-1.5 mr-1.5" color="neutral">
          {{ demographic.name }}
        </UBadge>
      </ULink>
    </div>
    <div v-if="genres && genres.length > 0" class="p-4 sm:p-4">
      <h4>{{ $t("general.genres") }}</h4>
      <ULink
        v-for="genre in genres"
        :key="genre.id"
        :to="withQuery('/browse/titles', { genre: genre.id })"
      >
        <UBadge class="mt-1.5 mr-1.5" color="neutral">
          {{ genre.name }}
        </UBadge>
      </ULink>
    </div>
    <div v-if="works && works.length > 0" class="space-y-3 p-4 sm:p-4">
      <div v-for="work in works" :key="work.id">
        <h4>{{ work.name }}</h4>
        <ULink :to="joinURL('/staff', work.staff)">
          {{ work.expand!.staff.name }}
        </ULink>
      </div>
    </div>
    <div
      v-if="additionalNames && additionalNames.length > 0"
      class="p-4 sm:p-4"
    >
      <h4>{{ $t("general.differentName") }}</h4>
      <div v-for="{ id, name } in additionalNames" :key="id">
        {{ name }}
      </div>
    </div>
  </UCard>
</template>
