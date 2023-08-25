<script setup lang="ts">
import { Collections, FormatResponse, TitleResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const props = defineProps<{
  modelValue: boolean;
  title: TitleResponse | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [boolean];
  "update:title": [TitleResponse];
}>();

const columns = computed(() => [
  {
    key: "cover",
    label: t("general.coverImages"),
    class: "w-[1%] whitespace-nowrap",
  },
  {
    key: "name",
    label: t("general.name"),
  },
  {
    key: "actions",
  },
]);

const page = ref(1);
const search = ref("");
const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
const title = computed({
  get: () => props.title,
  set: (v) => {
    if (v) emit("update:title", v);
    isOpen.value = false;
  },
});

const {
  data: titles,
  pending,
  execute,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Title).getList<
      TitleResponse<{
        format: FormatResponse;
      }>
    >(page.value, 5, {
      expand: "format",
      sort: "+name",
      filter: `name ~ '${search.value}'`,
    }),
  { watch: [page], transform: (titles) => structuredClone(titles) },
);
</script>

<template>
  <UModal v-model="isOpen">
    <form
      class="flex items-center justify-start gap-3 border-b border-gray-300 p-3 dark:border-gray-700"
      @submit.prevent="
        () => {
          page = 1;
          execute();
        }
      "
    >
      <UInput v-model="search" :placeholder="$t('general.searchPlaceholder')" />
      <UButton color="gray" icon="i-fluent-search-20-filled" type="submit" />
    </form>

    <UTable
      v-if="titles?.items"
      :columns="columns"
      :rows="titles.items"
      :loading="pending"
      @select="(row: TitleResponse) => (title = row)"
    >
      <template #cover-data="{ row }">
        <div v-if="row.cover" class="flex justify-center">
          <NuxtImg
            class="aspect-[2/3] h-14 rounded object-cover"
            :src="getPocketBaseImagePath(row, row.cover)"
          />
        </div>
      </template>
      <template #name-data="{ row }">
        <div class="space-y-1.5">
          <UBadge color="gray">{{ row.expand.format.name }}</UBadge>
          <div>{{ row.name }}</div>
        </div>
      </template>
      <template #actions-data>
        <div class="flex justify-end text-lg">
          <UIcon name="i-fluent-chevron-right-20-filled" />
        </div>
      </template>
    </UTable>

    <div
      class="flex items-center justify-end border-t border-gray-300 p-3 dark:border-gray-700"
    >
      <UPagination
        v-if="titles?.items"
        v-model="page"
        :page-count="5"
        :total="titles.totalItems"
      />
    </div>
  </UModal>
</template>
