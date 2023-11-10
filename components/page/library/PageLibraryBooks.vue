<script setup lang="ts">
import { Collections } from "@/types/pb";

const props = defineProps<{
  collectionId: string;
}>();

const { $pb } = useNuxtApp();
const { t } = useI18n();
const { pending, data: rows } = await useLazyAsyncData(props.collectionId, () =>
  $pb.collection(Collections.CollectionBooks).getFullList({
    filter: `collection = '${props.collectionId}'`,
  }),
);
</script>

<template>
  <UTable
    :rows="rows || []"
    :loading="pending"
    :ui="{
      wrapper: 'relative overflow-x-auto',
      td: { base: 'whitespace-nowrap lg:whitespace-normal' },
    }"
  >
    <template #edition-data="{ row }">
      <UBadge v-if="row.edition" color="tanaamber">
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
