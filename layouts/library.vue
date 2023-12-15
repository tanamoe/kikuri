<script setup lang="ts">
import { type UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const { currentUser, isAuthenticated } = useAuthentication();
const { isOpen, open } = useLibraryCollectionCreate();

const route = useRoute();

const { data: links } = await useAsyncData(
  () =>
    $pb.send<UserCollectionsResponse>(
      `/api/user-collections/${currentUser.value?.id}`,
      {
        method: "GET",
        expand: "collection",
      },
    ),
  {
    watch: [isOpen],
    transform: (collections) => [
      collections.items.map(
        (
          item,
        ): {
          icon?: string;
          label: string;
          to?: string;
          click?: () => void;
        } => ({
          label: item.collection!.name,
          to: item.collection!.id,
        }),
      ),
    ],
  },
);

const sticky = computed(() => route.meta.stickyNav as boolean);
const overflow = computed(() => route.meta.childOverflow ?? true);
</script>

<template>
  <div>
    <NavigationBar :sticky="sticky" />

    <main class="container mx-auto min-h-[80vh] overflow-x-hidden px-6 pb-6">
      <div class="flex flex-col gap-6 sm:flex-row">
        <aside
          v-if="links && isAuthenticated"
          class="flex flex-shrink-0 items-center gap-1 overflow-x-auto sm:block sm:w-48"
        >
          <AppSideNavigation :links="links" />
          <UButton
            class="sm:mt-3 sm:w-full"
            active-class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
            icon="i-fluent-collections-20-filled"
            color="gray"
            variant="ghost"
            @click="open"
          >
            {{ $t("library.createCollection") }}
          </UButton>
        </aside>
        <div class="flex-1" :class="{ 'overflow-x-auto': overflow }">
          <slot />
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>
