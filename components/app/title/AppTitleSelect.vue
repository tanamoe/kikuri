<script setup lang="ts">
import {
  Collections,
  type FormatsResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { TableColumn, TableRow } from "@nuxt/ui";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const props = defineProps<{
  modelValue: string;
  initialName?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const page = ref(1);
const query = ref("");
const isOpen = ref(false);
const name = ref<string>(props.initialName || "");

const {
  data: titles,
  status,
  execute,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Titles).getList<
      TitlesResponse<
        unknown,
        {
          format: FormatsResponse;
        }
      >
    >(page.value, 5, {
      expand: "format",
      sort: "+name",
      filter: `name~'${query.value}'`,
    }),
  {
    watch: [page],
  },
);

const id = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const columns = computed<
  TableColumn<TitlesResponse<unknown, { format: FormatsResponse }>>[]
>(() => [
  {
    accessorKey: "cover",
    header: t("general.coverImages"),
  },
  {
    accessorKey: "name",
    header: t("general.name"),
  },
  {
    key: "actions",
    header: "",
  },
]);

function search() {
  page.value = 1;
  execute();
}

function select(row: TableRow<TitlesResponse>, _e?: Event) {
  name.value = row.original.name;
  id.value = row.id;
  isOpen.value = false;
}
</script>

<template>
  <UButton color="neutral" variant="solid" block @click="isOpen = true">
    <span v-if="name">{{ name }}</span>
    <span v-else>{{ $t("review.titleSelect") }}</span>
  </UButton>
  <UModal v-model="isOpen">
    <form
      class="flex items-center justify-start gap-3 border-b border-neutral-300 p-3 dark:border-neutral-700"
      @submit.prevent="search"
    >
      <UInput v-model="query" :placeholder="$t('general.searchPlaceholder')" />
      <UButton color="neutral" icon="i-fluent-search-20-filled" type="submit" />
    </form>

    <UTable
      v-if="titles?.items"
      :columns
      :data="titles.items"
      :loading="status == 'pending'"
      @select="select"
    >
      <template #cover-cell="{ row }">
        <div v-if="row.original.cover" class="flex justify-center">
          <img
            class="aspect-[2/3] h-14 rounded object-cover"
            :src="$pb.files.getURL(row, row.original.cover)"
          />
        </div>
      </template>
      <template #name-cell="{ row }">
        <div class="space-y-1.5">
          <UBadge color="neutral">
            {{ row.original.expand?.format.name }}
          </UBadge>
          <div>{{ row.original.name }}</div>
        </div>
      </template>
      <template #actions-cell>
        <div class="flex justify-end text-lg">
          <UIcon name="i-fluent-chevron-right-20-filled" />
        </div>
      </template>
    </UTable>

    <div
      class="flex items-center justify-end border-t border-neutral-300 p-3 dark:border-neutral-700"
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
