<script setup lang="ts">
import {
  Collections,
  type BookDetailsResponse,
  type PublicationsResponse,
} from "@/types/pb";
import type { MetadataCommon, MetadataLibrary } from "@/types/common";
import type { LibraryBookAdd } from "#build/components";

const props = defineProps<{
  open: boolean;
  releaseId: string;
}>();

const { $pb } = useNuxtApp();
const { t } = useI18n();

const {
  data: rows,
  execute,
  refresh,
} = await useLazyAsyncData(
  props.releaseId,
  () =>
    $pb.collection(Collections.BookDetails).getFullList<
      BookDetailsResponse<
        MetadataCommon & MetadataLibrary,
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
        id: book.id,
        volume: book.expand?.publication.volume
          ? parseVolume(book.expand?.publication.volume)
          : 0,
        name: book.expand!.publication.name,
        edition: book.edition,
        publishDate: book.publishDate,
        price: book.price,
        note: book.note,
        metadata: book.metadata,
      })),
  },
);

const addModal = ref<undefined | InstanceType<typeof LibraryBookAdd>>();

const ui = {
  wrapper: "relative overflow-x-auto",
  td: {
    base: "whitespace-nowrap lg:whitespace-normal",
  },
};

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
    label: t("general.publishDate"),
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

function handleAdd(row: NonNullable<typeof rows.value>[0]) {
  addModal.value?.open(
    {
      id: row.id,
      name: row.name,
    },
    row.metadata?.inCollections?.map((c) => c.id),
  );
}

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
    class="[font-feature-settings:'ss01']"
    :ui="ui"
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
      <span v-if="row.publishDate">
        {{ $d(new Date(row.publishDate), "publishDate") }}
      </span>
    </template>
    <template #price-data="{ row }">
      <span>
        {{ $n(row.price, "currency", "vi") }}
      </span>
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
    <template
      #actions-data="{ row }: { row: NonNullable<typeof rows.value>[0] }"
    >
      <div
        v-if="$pb.authStore.isValid"
        class="flex items-center justify-end gap-1 whitespace-nowrap text-right"
      >
        <UPopover v-if="row.metadata?.inCollections" mode="hover">
          <UTooltip :text="$t('library.view')" :popper="{ placement: 'top' }">
            <UButton
              icon="i-fluent-library-20-filled"
              color="gray"
              variant="ghost"
              square
            />
          </UTooltip>

          <template v-if="row.metadata?.inCollections" #panel>
            <UCard
              :ui="{
                body: {
                  padding: 'p-0 sm:p-0',
                },
                header: {
                  padding: 'px-3 py-2 sm:px-3 sm:py-2',
                },
              }"
            >
              <UButton
                v-for="collection in row.metadata.inCollections"
                :key="collection.id"
                :to="`/library/${collection.id}`"
                color="gray"
                variant="ghost"
                block
              >
                {{ collection.name }}
              </UButton>
            </UCard>
          </template>
        </UPopover>

        <UTooltip
          :text="$t('library.addToLibrary')"
          :popper="{ placement: 'top' }"
        >
          <UButton
            icon="i-fluent-book-add-20-filled"
            color="gray"
            variant="ghost"
            square
            @click="handleAdd(row)"
          />
        </UTooltip>
      </div>
      <div v-else></div>
    </template>
  </UTable>

  <LazyLibraryBookAdd ref="addModal" @update="() => refresh()" />
</template>
