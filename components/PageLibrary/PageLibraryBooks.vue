<script setup lang="ts">
import {
  type CollectionBookDetailedResponse,
  Collections,
  type BookDetailedResponse,
} from "@/types/pb";

const props = defineProps<{
  collectionId: string;
}>();

const { $pb } = useNuxtApp();
const { t } = useI18n();
const { pending, data: rows } = await useLazyAsyncData(props.collectionId, () =>
  $pb.collection(Collections.CollectionBookDetailed).getFullList<
    CollectionBookDetailedResponse<{
      detail: BookDetailedResponse;
    }>
  >({
    filter: `collection = '${props.collectionId}'`,
    expand: "detail",
  }),
);

const columns = [
  {
    key: "cover",
    label: t("general.coverImages"),
    class: "whitespace-nowrap w-0",
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
</script>

<template>
  <UTable
    :columns="columns"
    :rows="rows || []"
    :loading="pending"
    :ui="{
      wrapper: 'relative overflow-x-auto',
      td: { base: 'whitespace-nowrap lg:whitespace-normal' },
    }"
  >
    <template #cover-data="{ row }">
      <AppCover
        :book="row"
        :file-name="row.cover[0] || row.baseCover[0]"
        :width="200"
      />
    </template>
    <template #edition-data="{ row }">
      <UBadge v-if="row.edition" color="tanaamber" variant="overlay">
        {{ row.edition }}
      </UBadge>
    </template>
    <template #volume-data="{ row }">
      <span>{{ parseVolume(row.volume) }}</span>
    </template>
    <template #name-data="{ row }">
      <span>{{ row.name }}</span>
    </template>
    <template #publishDate-data="{ row }">
      <span v-if="row.publishDate">
        {{ $d(new Date(row.publishDate)) }}
      </span>
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
