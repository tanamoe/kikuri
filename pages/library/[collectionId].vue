<script setup lang="ts">
import type { BreadcrumbLink } from "#ui/types";
import type {
  UserCollectionMembersResponse,
  UserCollectionBooksResponse,
  UserCollectionResponse,
  CollectionBookResponse,
} from "@/types/api/collections";
import MiniSearch from "minisearch";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const settingsStore = useSettingsStore();
const { ogUrl } = useRuntimeConfig().public;

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

const { data, refresh } = await useAsyncData(() =>
  $pb.send<UserCollectionBooksResponse>(
    `/api/user-collection/${route.params.collectionId}/books`,
    {
      method: "GET",
      perPage: 999,
      expand: "book.publication.release.title,collection,book.defaultAsset",
    },
  ),
);

const miniSearch = new MiniSearch({
  fields: ["normalizedName"],
  searchOptions: {
    fuzzy: 0.1,
    prefix: true,
  },
});

const state = ref({
  group: settingsStore.library.groupBy,
  sort: settingsStore.library.sort,
});
const query = ref("");
const debounced = refDebounced(query, 500);

const items = computed<Record<string, CollectionBookResponse[]>>(() => {
  const items = data.value?.items;
  if (!items) return {};

  if (state.value.group === "status") {
    return Object.groupBy(items, (item) => item.status);
  }
  if (state.value.group === "release") {
    return Object.groupBy(
      items,
      (item) => item.book!.publication!.release!.name!,
    );
  }
  if (debounced.value !== "") {
    const results = miniSearch.search(normalize(debounced.value));
    return {
      nogroup: items.filter((item) => results.some(({ id }) => item.id === id)),
    };
  }
  return {
    nogroup: items,
  };
});

watchEffect(() => {
  if (debounced.value != "") {
    state.value.group = "none";
  }

  if (data.value) {
    miniSearch.removeAll();
    miniSearch.addAll(
      data.value.items.map(
        (book) =>
          book.book?.publication?.name && {
            id: book.id,
            name: book.book.publication.name,
            normalizedName: normalize(book.book.publication.name),
          },
      ),
    );
  }
});

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

definePageMeta({
  layout: false,
});

const ogImage = computed(() => {
  if (collection.value?.item) {
    const url = new URL("/collection", ogUrl);
    url.searchParams.set("title", collection.value.item.name);

    if (description.value) {
      url.searchParams.set("description", description.value);
    }

    if (collection.value.item.owner) {
      const user = collection.value.item.owner;
      url.searchParams.set("user", user.displayName || user.username);
      if (user.avatar) {
        url.searchParams.set(
          "avatar",
          $pb.files.getUrl(
            {
              collectionId: "users",
              id: user.id,
            },
            user.avatar,
            { thumb: "32x32" },
          ),
        );
      }
    }

    return url;
  }

  return null;
});

const description = computed(() => {
  if (collection.value?.item.description) {
    const desc = collection.value.item.description.replace(/<[^>]*>/g, "");

    if (desc.length > 250) {
      return desc.slice(0, 250) + "…";
    }

    return desc;
  }

  return null;
});

useSeoMeta({
  title: t("seo.collectionTitle", {
    name: collection.value.item.name,
  }),
  description: description.value,
  ogTitle: t("seo.collectionTitle", {
    name: collection.value.item.name,
  }),
  ogDescription: description.value,
  ogImage: ogImage.value?.toString(),
});
</script>

<template>
  <NuxtLayout v-if="collection && items" name="library">
    <template #sidebar>
      <LibraryBooksGroupNavigation
        v-if="state.group !== 'none'"
        :groups="items"
      />
    </template>

    <div>
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

      <div class="prose prose-sm mb-6 max-w-none space-y-2 dark:prose-invert">
        <div v-html="collection.item.description" />

        <div class="flex gap-6">
          <LibraryMembers v-if="members" :members />
          <LibraryVisibility
            v-if="collection.item.visibility"
            :visibility="collection.item.visibility"
          />
        </div>
      </div>

      <LibraryToolbar
        v-model:query="query"
        v-model:group="state.group"
        v-model:sort="state.sort"
        class="mb-6"
      />

      <LibraryBooksGroup
        v-if="state.group !== 'none'"
        :groups="items"
        :editable
        :callback="refresh"
      />

      <LibraryBooksList
        v-else
        :editable
        :books="items.nogroup"
        :callback="refresh"
      />
    </div>
  </NuxtLayout>
</template>
