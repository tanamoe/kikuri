<script setup lang="ts">
import {
  type BooksResponse,
  Collections,
  type BookMetadataResponse,
  type PublicationsResponse,
  type AssetsResponse,
} from "@/types/pb";
import type { MetadataImages, MetadataLibrary } from "@/types/common";
import { LibraryModalBookAdd, LibraryModalBookAddBulk } from "#components";

const props = defineProps<{
  open: boolean;
  releaseId: string;
}>();

const { $pb } = useNuxtApp();
const { t } = useI18n();
const modal = useModal();
const { display } = useSettingsStore();

const {
  data: rows,
  execute,
  refresh,
} = await useLazyAsyncData(
  props.releaseId,
  () =>
    $pb.collection(Collections.Books).getFullList<
      BooksResponse<
        MetadataLibrary["inCollections"],
        {
          publication: PublicationsResponse;
          bookMetadata_via_book: BookMetadataResponse;
          assets_via_book: AssetsResponse<MetadataImages>[];
        }
      >
    >({
      filter: $pb.filter("publication.release = {:release}", {
        release: props.releaseId,
      }),
      expand: "publication,bookMetadata_via_book,assets_via_book",
      sort: "+publication.volume,+publishDate,+edition,+assets_via_book.priority",
      fields:
        "*,expand.publication.*,expand.bookMetadata_via_book.*,expand.assets_via_book.*",
    }),
  {
    transform: (books) =>
      books.map((book) => ({
        id: book.id,
        volume: book.expand?.publication?.volume
          ? parseVolume(book.expand?.publication.volume)
          : 0,
        name: book.expand?.publication.name ?? book.id,
        edition: book.edition,
        publishDate: book.publishDate,
        price: book.price,
        note: book.note,
        metadata: book.expand?.bookMetadata_via_book,
        inCollections: book.metadata,
        assets: book.expand?.assets_via_book,
      })),
  },
);

const show = ref({
  metadata: display.bookMetadata,
});

const ui = {
  wrapper: "relative overflow-x-auto",
  td: {
    base: "whitespace-normal lg:whitespace-normal",
    color: "text-gray-600 dark:text-gray-300",
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
    key: "actions",
  },
];

function handleAdd(row: NonNullable<typeof rows.value>[0]) {
  modal.open(LibraryModalBookAdd, {
    book: {
      id: row.id,
      name: row.name,
    },
    inCollections: row.inCollections?.map((c) => c.id),
    callback: refresh,
  });
}

function handleAddBulk() {
  if (selected.value) {
    modal.open(LibraryModalBookAddBulk, {
      books: selected.value.map((book) => ({
        id: book.id,
        name: book.name,
      })),
      callback: refresh,
    });
  }
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

const selected = ref<NonNullable<typeof rows.value> | undefined>(
  $pb.authStore.isAuthRecord ? [] : undefined,
);
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-end">
      <UCheckbox
        v-model="show.metadata"
        name="show.metadata"
        :label="$t('settings.showMetadataLocal')"
      />
    </div>
    <UTable
      v-model="selected"
      :columns="columns"
      :rows="rows || []"
      class="[font-feature-settings:'ss01']"
      :ui="ui"
    >
      <template #volume-data="{ row }">
        <UBadge variant="soft" color="gray">{{ row.volume }}</UBadge>
      </template>
      <template
        #name-data="{ row }: { row: NonNullable<typeof rows.value>[0] }"
      >
        <div class="min-w-52">
          <UBadge
            v-if="row.edition"
            color="tanaamber"
            class="mb-2 bg-opacity-50 text-gray-900 backdrop-blur"
          >
            {{ row.edition }}
          </UBadge>
          <div>{{ row.name }}</div>
          <div
            v-if="show.metadata"
            class="mt-3 space-y-3 text-xs dark:text-gray-400"
          >
            <div v-if="row.metadata">
              <div>
                <span v-if="row.metadata.isbn">
                  {{ $t("metadata.isbn") }}: {{ row.metadata.isbn }}
                </span>
              </div>
              <div class="space-x-3">
                <span v-if="row.metadata.pageCount">
                  {{ $t("metadata.pageCount") }}: {{ row.metadata.pageCount }}
                </span>
                <span v-if="row.metadata.weight">
                  {{ $t("metadata.weight") }}: {{ row.metadata.weight }}
                </span>
              </div>
              <div>
                {{ $t("metadata.size") }}:
                {{
                  $t("metadata.dimension", {
                    x: row.metadata.sizeX,
                    y: row.metadata.sizeY,
                    z: row.metadata.sizeZ || "?",
                  })
                }}
              </div>
            </div>
            <div v-if="row.note" class="text-xs dark:text-gray-400">
              <p v-for="(note, key) of row.note.split('\n')" :key>{{ note }}</p>
            </div>

            <div
              v-if="
                row.assets &&
                row.assets.filter((asset) => asset.type != '0000000000cover')
                  .length > 0
              "
              class="grid grid-cols-4 gap-3 lg:grid-cols-6 xl:grid-cols-8"
            >
              <template
                v-for="asset in row.assets.filter(
                  (asset) => asset.type != '0000000000cover',
                )"
                :key="asset.id"
              >
                <ULink
                  :to="$pb.files.getUrl(asset, asset.image)"
                  target="_blank"
                >
                  <AppImage
                    v-if="asset.resizedImage"
                    class="aspect-[1/1] h-full w-full rounded object-cover transition-all hover:brightness-75"
                    :src="asset.resizedImage['1280w']"
                    :srcset="asset.resizedImage"
                  />
                </ULink>
              </template>
            </div>
          </div>
        </div>
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
      <template
        #actions-data="{ row }: { row: NonNullable<typeof rows.value>[0] }"
      >
        <div
          class="flex items-center justify-end gap-1 whitespace-nowrap text-right"
        >
          <template v-if="$pb.authStore.isValid">
            <UPopover v-if="row.inCollections" mode="hover">
              <UTooltip
                :text="$t('library.view')"
                :popper="{ placement: 'top' }"
              >
                <UButton
                  icon="i-fluent-library-20-filled"
                  color="gray"
                  variant="ghost"
                  square
                />
              </UTooltip>

              <template v-if="row.inCollections" #panel>
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
                    v-for="collection in row.inCollections"
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
          </template>
        </div>
      </template>
    </UTable>

    <UButton
      v-if="$pb.authStore.isAuthRecord && selected"
      :label="$t('library.addToLibraryBulk')"
      icon="i-fluent-book-add-20-filled"
      color="gray"
      :disabled="selected.length <= 0"
      @click="handleAddBulk()"
    />
  </div>
</template>
