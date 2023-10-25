<script setup lang="ts">
import {
  Collections,
  type FormatsResponse,
  type TitlesResponse,
} from "@/types/pb";

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
  pending,
  execute,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Titles).getList<
      TitlesResponse<{
        format: FormatsResponse;
      }>
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

function search() {
  page.value = 1;
  execute();
}

function select(row: TitlesResponse) {
  name.value = row.name;
  id.value = row.id;
  isOpen.value = false;
}
</script>

<template>
  <UButton color="white" variant="solid" block @click="isOpen = true">
    <span v-if="name">{{ name }}</span>
    <span v-else>{{ $t("review.titleSelect") }}</span>
  </UButton>
  <UModal v-model="isOpen">
    <form
      class="flex items-center justify-start gap-3 border-b border-gray-300 p-3 dark:border-gray-700"
      @submit.prevent="search"
    >
      <UInput v-model="query" :placeholder="$t('general.searchPlaceholder')" />
      <UButton color="gray" icon="i-fluent-search-20-filled" type="submit" />
    </form>

    <UTable
      v-if="titles?.items"
      :columns="columns"
      :rows="titles.items"
      :loading="pending"
      @select="select"
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
