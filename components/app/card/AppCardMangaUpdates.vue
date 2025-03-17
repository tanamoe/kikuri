<script setup lang="ts">
import type { CardProps } from "@nuxt/ui";

const props = defineProps<{
  name: string;
}>();

const { data: series } = await useFetch("/api/mangaupdates", {
  query: {
    name: props.name,
  },
});

const ui: CardProps["ui"] = {
  body: "divide-y divide-(--ui-border) p-4 sm:p-4",
  footer: "px-4 py-2 sm:px-4",
};
</script>

<template>
  <UCard
    v-if="series"
    class="prose-a:hover:text-(--ui-primary) prose prose-sm dark:prose-invert prose-h4:my-0 prose-a:text-(--ui-text-muted) prose-img:my-0 prose-hr:my-3 max-w-none"
    :ui
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
      <div
        class="flex items-center gap-1 text-neutral-500 dark:text-neutral-500"
      >
        <UIcon name="i-fluent-info-20-filled" />
        <i18n-t keypath="general.informationFrom" tag="span">
          <ULink :to="series.url">MangaUpdates</ULink>
        </i18n-t>
      </div>
    </template>
  </UCard>
</template>
