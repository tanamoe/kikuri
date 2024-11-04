<script setup lang="ts">
import type { BreadcrumbLink } from "#ui/types";
import type {
  UserCollectionMembersResponse,
  UserCollectionBooksResponse,
  UserCollectionResponse,
} from "@/types/api/collections";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n();
const settingsStore = useSettingsStore();

const view = ref(settingsStore.library.view);
const page = useRouteQuery("p", "1", { transform: Number });
const perPage = useRouteQuery("limit", "12", { transform: Number });

const { data: collection } = await useAsyncData(() =>
  $pb.send<UserCollectionResponse>(
    `/api/user-collection/${route.params.collectionId}`,
    {
      expand: "owner",
    },
  ),
);
if (!collection.value) throw createError({ statusCode: 404 });

const { data: members } = await useAsyncData(() =>
  $pb.send<UserCollectionMembersResponse>(
    `/api/user-collection/${route.params.collectionId}/members`,
    { expand: "user" },
  ),
);

const { data: books, refresh } = await useLazyAsyncData(
  () =>
    $pb.send<UserCollectionBooksResponse>(
      `/api/user-collection/${route.params.collectionId}/books`,
      {
        method: "GET",
        page: page.value,
        perPage: perPage.value,
        expand: "book.publication.release.title,collection,book.defaultAsset",
      },
    ),
  { watch: [page, perPage] },
);

const editable = computed(() => {
  if (!$pb.authStore.isAuthRecord) return false;
  const m = members.value?.items.find(
    (member) => member.userId === $pb.authStore.model?.id,
  );
  if (!m) return false;
  if (m.role === "EDITOR") return true;
  return false;
});

const links = computed<BreadcrumbLink[]>(() => [
  {
    label:
      collection.value!.item.owner!.displayName ||
      collection.value!.item.owner!.username,
    to: collection.value?.item.owner
      ? `/user/${collection.value.item.owner.username}`
      : undefined,
  },
  {
    label: t("general.library"),
  },
]);

watchEffect(() => {
  if (books.value && books.value.totalPages < page.value)
    page.value = books.value.totalPages;
  if (page.value === 0) page.value = 1;
});

watch(page, () => window.scrollTo({ top: 0, behavior: "smooth" }));

definePageMeta({
  layout: "library",
});

useSeoMeta({
  title: t("seo.collectionTitle", {
    name: collection.value.item.name,
  }),
  description: collection.value.item.description,
  ogTitle: t("seo.collectionTitle", {
    name: collection.value.item.name,
  }),
  ogDescription: collection.value.item.description,
});
</script>

<template>
  <div v-if="collection && books">
    <UBreadcrumb class="mb-3" :links />

    <div class="float-right flex h-min items-center justify-end gap-3">
      <AppShareButton :title="collection.item.name" show-label />
      <LibraryOptions
        :id="collection.item.id"
        :name="collection.item.name"
        :editable
      />
    </div>
    <AppH1>{{ collection.item.name }}</AppH1>

    <div class="space-y-6">
      <div class="prose prose-sm max-w-none space-y-2 dark:prose-invert">
        <div
          v-if="collection.item.description"
          v-html="collection.item.description"
        />

        <div class="flex gap-6">
          <LibraryMembers v-if="members" :members />
          <LibraryVisibility
            v-if="collection.item.visibility"
            :visibility="collection.item.visibility"
          />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <InputLibraryPerPageOption v-model="perPage" />
        <UButtonGroup size="sm" orientation="horizontal">
          <UButton
            icon="i-fluent-grid-20-filled"
            :color="view === 'grid' ? 'primary' : 'gray'"
            @click="() => (view = 'grid')"
          />
          <UButton
            icon="i-fluent-grid-kanban-20-filled"
            :color="view === 'list' ? 'primary' : 'gray'"
            @click="() => (view = 'list')"
          />
          <UButton
            icon="i-fluent-list-20-filled"
            :color="view === 'table' ? 'primary' : 'gray'"
            @click="() => (view = 'table')"
          />
        </UButtonGroup>
      </div>

      <LibraryBooks :books="books.items" :view :editable @change="refresh" />

      <UPagination
        v-model="page"
        class="justify-center"
        size="sm"
        :page-count="books.perPage"
        :total="books.totalItems"
        show-last
        show-first
      />
    </div>
  </div>
</template>
