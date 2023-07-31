<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  releaseId: string;
}>();

const { t } = useI18n();
const { isLoading, state: rows, execute } = useAsyncBookDetailed();

const columns = [
  {
    key: "volume",
    label: t("general.volume"),
    class: "whitespace-nowrap w-0",
    sortable: true,
  },
  {
    key: "name",
    label: t("general.name"),
  },
  {
    key: "edition",
    label: t("general.edition"),
    class: "whitespace-nowrap w-0",
    sortable: true,
  },
  {
    key: "publishDate",
    label: t("general.releaseDate"),
    class: "whitespace-nowrap w-0",
    sortable: true,
  },
  {
    key: "price",
    label: t("general.price"),
    class: "whitespace-nowrap w-0",
  },
  {
    key: "actions",
  },
];

const watcher = watch(
  () => props.open,
  () => {
    if (props.open === true) {
      execute(0, props.releaseId);
      watcher();
    }
  }
);
</script>

<template>
  <UTable
    :columns="columns"
    :rows="rows || []"
    :loading="isLoading"
    :ui="{
      wrapper: 'relative overflow-x-auto',
      td: { base: 'whitespace-nowrap lg:whitespace-normal' },
    }"
  >
    <template #edition-data="{ row }">
      <UBadge v-if="row.edition" color="amber">{{ row.edition }}</UBadge>
    </template>
    <template #publishDate-data="{ row }">
      <span v-if="row.publishDate">{{ $d(new Date(row.publishDate)) }}</span>
    </template>
    <template #price-data="{ row }">
      <span>{{ $n(row.price, "currency", "vi") }}</span>
    </template>
    <template #actions-data>
      <div class="text-right">
        <UButton
          icon="i-fluent-add-20-filled"
          color="gray"
          variant="ghost"
          square
          disabled
        />
        <UButton
          icon="i-fluent-edit-20-filled"
          color="gray"
          variant="ghost"
          square
          disabled
        />
        <UButton
          icon="i-fluent-delete-20-filled"
          color="red"
          variant="ghost"
          square
          disabled
        />
      </div>
    </template>
  </UTable>
</template>
