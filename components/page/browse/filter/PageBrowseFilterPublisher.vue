<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const store = useBrowseStore();

const { data: publishers, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Publishers).getFullList(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        id: publisher.id,
        label: publisher.name,
        color: publisher.color,
        avatar:
          publisher.logo !== ""
            ? {
                src: $pb.files.getUrl(publisher, publisher.logo),
              }
            : undefined,
      })),
    default: () => [],
  },
);

const selected = computed(() => {
  if (publishers.value) {
    return publishers.value.filter((p) => store.publishers.includes(p.id));
  }
});
</script>

<template>
  <USelectMenu
    v-model="store.publishers"
    :options="publishers"
    multiple
    searchable
    value-attribute="id"
    :searchable-placeholder="$t('general.searchPlaceholder')"
    :loading="pending"
  >
    <template #label>
      <template v-if="selected && selected.length > 0">
        <span class="flex items-center -space-x-1">
          <template v-for="publisher of selected" :key="publisher.id">
            <span
              v-if="publisher.color"
              class="mt-px h-2 w-2 flex-shrink-0 rounded-full"
              :style="{ background: publisher.color }"
            />
          </template>
        </span>
        <span class="truncate">
          {{ $t("general.publisherCount", { count: store.publishers.length }) }}
        </span>
      </template>
      <span v-else class="truncate">{{ $t("general.publisherSelect") }}</span>
    </template>
  </USelectMenu>
</template>
