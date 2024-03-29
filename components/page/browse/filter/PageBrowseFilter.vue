<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const store = useBrowseStore();

const emit = defineEmits<{
  change: [void];
}>();

const filterCount = computed(
  () =>
    store.publishers.length +
    store.formats.length +
    store.status.length +
    store.demographics.length +
    store.genres.length,
);

function apply() {
  router.replace({
    path: route.path,
    query: {
      p: store.page,
      q: store.query,
      s: store.sort,
      format: store.formats,
      demographic: store.demographics,
      status: store.status,
      publisher: store.publishers,
      genre: store.genres,
    },
  });

  emit("change");
}
</script>

<template>
  <UPopover
    :ui="{ base: 'overflow-visible', width: 'w-full max-w-xs md:max-w-md' }"
    :popper="{
      placement: 'bottom-start',
    }"
  >
    <UButton icon="i-fluent-filter-20-filled" color="gray">
      {{ $t("general.advancedFilter") }}
      <span v-if="filterCount > 0">({{ filterCount }})</span>
    </UButton>
    <template #panel>
      <UCard
        class="overflow-visible"
        :ui="{ body: { base: 'space-y-6', padding: 'p-6 sm:p-6' } }"
      >
        <div class="grid grid-cols-2 gap-6">
          <div class="">
            {{ $t("general.format") }}
            <PageBrowseFilterFormat />
          </div>
          <div class="">
            {{ $t("general.demographic") }}
            <PageBrowseFilterDemographic />
          </div>
          <div class="col-span-2">
            {{ $t("general.status") }}
            <PageBrowseFilterStatus />
          </div>
          <div class="col-span-2">
            {{ $t("general.publisher") }}
            <PageBrowseFilterPublisher />
          </div>
          <div class="col-span-2">
            {{ $t("general.genres") }}
            <PageBrowseFilterGenre />
          </div>
        </div>
        <div class="space-x-3 text-right">
          <UButton variant="ghost" color="red" @click="store.reset">
            {{ $t("general.reset") }}
          </UButton>
          <UButton @click="apply">{{ $t("general.apply") }}</UButton>
        </div>
      </UCard>
    </template>
  </UPopover>
</template>
