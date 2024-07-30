<script setup lang="ts">
import type { AdditionalTitleNamesResponse, TitlesResponse } from "@/types/pb";

const props = defineProps<{
  title: TitlesResponse<
    unknown,
    {
      additionalTitleNames_via_title: AdditionalTitleNamesResponse[];
    }
  >;
}>();
const { data: series } = await useFetch("/api/mangaupdates", {
  query: {
    name:
      props.title.expand?.additionalTitleNames_via_title?.[0].name ||
      props.title.name,
  },
});
</script>

<template>
  <UCard
    v-if="series"
    class="prose prose-sm max-w-none dark:prose-invert prose-h4:my-0 prose-a:text-gray-500 prose-a:no-underline hover:prose-a:text-[#db9b4f] hover:prose-a:underline prose-hr:my-3 dark:prose-a:text-gray-400 dark:hover:prose-a:text-[#db9b4f]"
    :ui="{
      body: {
        base: 'divide-y divide-gray-200 dark:divide-gray-800',
        padding: 'p-4 sm:p-4',
      },
      footer: {
        padding: 'px-4 py-2 sm:px-4',
      },
    }"
  >
    <div class="space-y-3">
      <div v-if="series.status">
        <h4 class="font-bold">{{ $t("general.originStatus") }}</h4>
        <div v-for="status in series.status.split('<BR>')" :key="status">
          {{ status }}
        </div>
      </div>

      <div v-if="series.year">
        <h4 class="font-bold">{{ $t("general.startedYear") }}</h4>
        <div>{{ series.year }}</div>
      </div>

      <div v-if="series.publishers">
        <h4 class="font-bold">{{ $t("general.originPublisher") }}</h4>
        <template v-for="publisher in series.publishers">
          <div
            v-if="publisher.type === 'Original'"
            :key="publisher.publisher_id"
          >
            {{ publisher.publisher_name }}
          </div>
        </template>
      </div>

      <div v-if="series.publications">
        <h4 class="font-bold">{{ $t("general.originPublication") }}</h4>
        <div
          v-for="publication in series.publications"
          :key="publication.publication_name"
        >
          {{ publication.publication_name }} ({{ publication.publisher_name }})
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center gap-1 text-gray-500 dark:text-gray-500">
        <UIcon name="i-fluent-info-20-filled" />
        <i18n-t keypath="general.informationFrom" tag="span">
          <ULink :to="series.url">MangaUpdates</ULink>
        </i18n-t>
      </div>
    </template>
  </UCard>
</template>
