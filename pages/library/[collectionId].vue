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

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const {
  params: { collectionId },
} = useRoute();
const { currentUser } = useAuthentication();
const settingsStore = useSettingsStore();

const { data: collection } = await useAsyncData(() =>
  $pb.send<UserCollectionResponse>(`/api/user-collection/${collectionId}`, {
    expand: "owner",
  }),
);
if (!collection.value) throw createError({ statusCode: 404 });

const { data: members } = await useAsyncData(() =>
  $pb.send<UserCollectionMembersResponse>(
    `/api/user-collection/${collectionId}/members`,
    { expand: "user" },
  ),
);

const { data: books, refresh } = await useAsyncData(() =>
  $pb.send<UserCollectionBooksResponse>(
    `/api/user-collection/${collectionId}/books`,
    {
      method: "GET",
      expand: "book.publication,collection",
    },
  ),
);

const editModal = ref<InstanceType<typeof LibraryBookEdit>>();
const removeModal = ref<InstanceType<typeof LibraryBookRemove>>();
const collectionRemoveModal =
  ref<InstanceType<typeof LibraryCollectionRemove>>();

const editable = computed(() => {
  if (!currentUser.value) return false;

  const m = members.value?.items.find(
    (member) => member.userId === currentUser.value!.id,
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
      to: `/library/edit?id=${collectionId}`,
    },
    {
      label: t("library.setDefaultCollection"),
      icon: "i-fluent-library-20-filled",
      disabled: settingsStore.library.defaultLibraryId === collectionId,
      click: () => {
        settingsStore.library.defaultLibraryId = collectionId as string;
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

useSeoMeta({
  title: t("seo.collectionTitle", {
    name: collection.value.item.name,
  }),
  description: collection.value.item.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 200),
  ogTitle: t("seo.collectionTitle", {
    name: collection.value.item.name,
  }),
  ogDescription: collection.value.item.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 200),
});
</script>

<template>
  <div v-if="collection">
    <UBreadcrumb class="mb-3" :links="links" />

    <div class="flex flex-col sm:flex-row">
      <AppH1 class="mb-6 flex-1">{{ collection.item.name }}</AppH1>
      <div class="flex h-min items-center justify-end gap-3">
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
    </div>

    <div class="prose prose-sm mb-6 max-w-none space-y-2 dark:prose-invert">
      <div v-html="collection.item.description" />

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

    <PageLibraryBooks
      v-if="books"
      :edit-modal="editModal"
      :remove-modal="removeModal"
      :editable="editable"
      :books="books"
      @update="refresh"
    />

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
