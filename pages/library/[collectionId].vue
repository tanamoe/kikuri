<script setup lang="ts">
import type { BreadcrumbLink } from "@nuxt/ui/dist/runtime/types";
import type {
  UserCollectionMembersResponse,
  UserCollectionBooksResponse,
  UserCollectionResponse,
} from "@/types/collections";
import type {
  LibraryBookEdit,
  LibraryBookRemove,
  LibraryCollectionRemove,
} from "#build/components";

const route = useRoute();
const settingsStore = useSettingsStore();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { ogUrl } = useRuntimeConfig().public;
const { collectionVisibility } = useOptions();

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

const { data: books, refresh } = await useAsyncData(
  () =>
    $pb.send<UserCollectionBooksResponse>(
      `/api/user-collection/${route.params.collectionId}/books`,
      {
        method: "GET",
        perPage: 999,
        expand: "book.publication,collection",
      },
    ),
  {
    transform: (response) =>
      response.items.map((item) => ({
        id: item.id,
        cover: item.book?.covers
          ? $pb.files.getUrl(
              {
                collectionId: item.book!.parentCollection,
                id: item.book!.parentId,
              },
              item.book!.covers[0],
            )
          : undefined,
        name: item.book!.publication.name,
        edition: item.book!.edition,
        digital: item.book!.publication.digital,
        publishDate: item.book?.publishDate
          ? new Date(item.book.publishDate)
          : undefined,
        quantity: item.quantity,
        price: item.book!.price,
        status: item.status,
        collection: item.collectionId,
        updated: new Date(item.updated),
        created: new Date(item.created),
      })),
  },
);

const editModal = ref<InstanceType<typeof LibraryBookEdit>>();
const removeModal = ref<InstanceType<typeof LibraryBookRemove>>();
const collectionRemoveModal =
  ref<InstanceType<typeof LibraryCollectionRemove>>();

const editable = computed(() => {
  if (!$pb.authStore.isAuthRecord) return false;

  const m = members.value?.items.find(
    (member) => member.userId === $pb.authStore.model?.id,
  );

  if (!m) return false;

  if (m.role === "EDITOR") return true;

  return false;
});

const currentVisibility = computed(() =>
  collectionVisibility.value.find(
    (v) => v.id === collection.value?.item.visibility,
  ),
);

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

const items = computed(() => [
  [
    {
      label: t("general.missingBooks"),
      icon: "i-fluent-book-question-mark-20-filled",
      to: "/missing-entries",
    },
  ],
  [
    {
      label: t("library.editCollection"),
      icon: "i-fluent-edit-20-filled",
      to: `/library/edit?id=${route.params.collectionId}`,
    },
    {
      label: t("library.setDefaultCollection"),
      icon: "i-fluent-library-20-filled",
      disabled:
        settingsStore.library.defaultLibraryId === route.params.collectionId,
      click: () => {
        settingsStore.library.defaultLibraryId = route.params
          .collectionId as string;
      },
    },
  ],
  [
    {
      label: t("general.settings"),
      icon: "i-fluent-settings-20-filled",
      to: "/settings/library",
    },
  ],
  [
    {
      label: t("library.removeCollection"),
      icon: "i-fluent-delete-20-filled",
      disabled: !collectionRemoveModal.value,
      click: () => {
        if (collectionRemoveModal.value) {
          collectionRemoveModal.value.open();
        }
      },
    },
  ],
]);

definePageMeta({
  layout: "library",
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
});

const description = computed(() => {
  if (collection.value?.item.description) {
    const desc = collection.value.item.description.replace(/<[^>]*>/g, "");
    if (desc.length > 250) {
      return desc.slice(0, 250) + "...";
    }
    return desc;
  }
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
  <div v-if="collection">
    <UBreadcrumb class="mb-3" :links="links" />

    <div>
      <div class="float-right flex h-min items-center justify-end gap-3">
        <AppShareButton :title="collection.item.name" show-label />
        <UDropdown
          v-if="editable"
          :items="items"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            trailing-icon="i-fluent-more-vertical-20-filled"
          />
        </UDropdown>
      </div>
      <AppH1>{{ collection.item.name }}</AppH1>
    </div>

    <div class="prose prose-sm mb-6 max-w-none space-y-2 dark:prose-invert">
      <div v-html="collection.item.description" />

      <div class="flex gap-6">
        <div>
          <h4>{{ $t("library.member") }}</h4>
          <UAvatarGroup v-if="members" size="sm">
            <UAvatar
              v-for="member in members.items"
              :key="member.userId"
              :src="
                member.user?.avatar
                  ? $pb.files.getUrl(
                      { collectionId: 'users', id: member.userId },
                      member.user.avatar,
                      { thumb: '32x32' },
                    )
                  : undefined
              "
              :alt="member.user?.displayName || member.user?.username"
            />
          </UAvatarGroup>
        </div>
        <div v-if="currentVisibility">
          <h4>{{ $t("library.visibility") }}</h4>
          <UBadge color="gray">
            {{ currentVisibility.label }}
          </UBadge>
        </div>
      </div>
    </div>

    <ClientOnly>
      <PageLibraryBooks
        v-if="books"
        :edit-modal="editModal"
        :remove-modal="removeModal"
        :editable="editable"
        :books="books"
        @update="refresh"
      />
    </ClientOnly>

    <LazyLibraryBookEdit ref="editModal" @update="refresh()" />
    <LazyLibraryBookRemove ref="removeModal" @update="refresh()" />
    <LazyLibraryCollectionRemove
      ref="collectionRemoveModal"
      :collection="{
        id: collection.item.id,
        name: collection.item.name,
      }"
    />
  </div>
</template>
