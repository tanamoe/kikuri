<script setup lang="ts">
import {
  Collections,
  type BookDetailsResponse,
  type PublicationsResponse,
} from "@/types/pb";
import type { MetadataCommon } from "~/types/common";

const props = defineProps<{
  open: boolean;
  releaseId: string;
}>();

const { $pb } = useNuxtApp();
const { t } = useI18n();
const {
  pending,
  data: rows,
  execute,
} = await useLazyAsyncData(
  props.releaseId,
  () =>
    $pb.collection(Collections.BookDetails).getFullList<
      BookDetailsResponse<
        MetadataCommon,
        string,
        {
          publication: PublicationsResponse;
        }
      >
    >({
      filter: `release='${props.releaseId}'`,
      expand: "publication",
    }),
  {
    transform: (books) =>
      books.map((book) => ({
        volume: book.expand?.publication.volume
          ? parseVolume(book.expand?.publication.volume)
          : 0,
        name: book.expand?.publication.name,
        edition: book.edition,
        publishDate: book.publishDate,
        price: book.price,
        note: book.note,
      })),
  },
);

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
    key: "note",
    label: "",
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
      execute();
      watcher();
    }
  },
);
</script>

<template>
  <UTable
    :columns="columns"
    :rows="rows || []"
    :loading="pending"
    class="[font-feature-settings:'ss01']"
    :ui="{
      wrapper: 'relative overflow-x-auto',
      td: {
        base: 'whitespace-nowrap lg:whitespace-normal',
      },
    }"
  >
    <template #edition-data="{ row }">
      <UBadge
        v-if="row.edition"
        color="tanaamber"
        class="bg-opacity-50 text-gray-900 backdrop-blur"
      >
        {{ row.edition }}
      </UBadge>
    </template>
    <template #publishDate-data="{ row }">
      <span v-if="row.publishDate">{{ $d(new Date(row.publishDate)) }}</span>
    </template>
    <template #price-data="{ row }">
      <span>{{ $n(row.price, "currency", "vi") }}</span>
    </template>
    <template #note-data="{ row }">
      <UTooltip
        v-if="row.note"
        :ui="{ base: 'whitespace-normal overflow-visible h-[unset]' }"
      >
        <UButton color="gray" icon="i-fluent-note-20-filled" />
        <template #text>
          <div>{{ row.note }}</div>
        </template>
      </UTooltip>
    </template>
    <template #actions-data>
      <div class="whitespace-nowrap text-right">
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
