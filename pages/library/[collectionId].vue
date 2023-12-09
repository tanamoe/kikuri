<script setup lang="ts">
import type { BreadcrumbLink } from "@nuxt/ui/dist/runtime/types";
import type {
  UserCollectionMembersResponse,
  UserCollectionBooksResponse,
  UserCollectionResponse,
} from "@/types/collections";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const {
  params: { collectionId },
} = useRoute();

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

const editable = computed(() => {
  if (!$pb.authStore.model) return false;

  const m = members.value?.items.find(
    (member) => member.userId === $pb.authStore.model!.id,
  );

  if (!m) return false;

  if (m.role === "EDITOR") return true;

  return false;
});

const links = computed<BreadcrumbLink[]>(() => [
  {
    label: collection.value!.item.owner!.displayName!,
    to: `/user/${collection.value!.item.ownerId}`,
  },
  {
    label: t("general.library"),
    to: `/library`,
  },
]);
</script>

<template>
  <PageLibrary v-if="collection">
    <template #aside>
      <PageLibraryAside />
    </template>

    <UBreadcrumb class="mb-3" :links="links" />

    <AppH1 class="mb-6">{{ collection.item.name }}</AppH1>

    <div class="prose prose-sm mb-6 max-w-none space-y-2 dark:prose-invert">
      <div v-html="collection.item.description" />

      <h4>{{ $t("library.member") }}</h4>
      <UAvatarGroup v-if="members" size="sm">
        <UAvatar
          v-for="member in members.items"
          :key="member.userId"
          :src="
            $pb.files.getUrl(
              { collectionId: 'users', id: member.userId },
              member.user?.avatar!,
            )
          "
          :alt="member.user!.displayName"
        />
      </UAvatarGroup>
    </div>

    <div
      v-if="books"
      class="rounded-md border border-gray-200 dark:border-gray-800"
    >
      <PageLibraryBooks :editable="editable" :books="books" />
    </div>

    <LazyLibraryEdit @update="refresh" />
  </PageLibrary>
</template>
