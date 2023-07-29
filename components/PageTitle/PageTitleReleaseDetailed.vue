<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  releaseId: string;
}>();

const { t } = useI18n();
const { isLoading, state: rows, execute } = useAsyncBookDetailed();

const columns = [
  {
    key: "name",
    label: t("general.name"),
  },
  {
    key: "publish_date",
    label: t("general.releaseDate"),
  },
  {
    key: "price",
    label: t("general.price"),
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
  <UTable :columns="columns" :rows="rows || []" :loading="isLoading">
    <template #publish_date-data="{ row }">
      <span>{{ $d(new Date(row.publish_date)) }}</span>
    </template>
    <template #actions-data>
      <div>
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
