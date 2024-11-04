<script setup lang="ts">
import { ModalCollectionCreate } from "#components";

const { $pb } = useNuxtApp();
const { collections } = useLibrary();
const { t } = useI18n();
const modal = useModal();
const route = useRoute();

const links = computed(() => [
  collections.value.map((item) => ({
    label: item.collection!.name,
    to: item.collection!.id,
  })),
  [
    {
      label: t("library.createCollection"),
      icon: "i-fluent-collections-20-filled",
      click: () => modal.open(ModalCollectionCreate),
    },
  ],
]);

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <NavigationBar :sticky="sticky" />

    <main
      class="mx-auto min-h-[80vh] overflow-x-hidden pb-6 sm:container sm:px-6"
    >
      <div class="flex flex-col gap-6 md:flex-row">
        <aside
          v-if="links && $pb.authStore.isAuthRecord"
          class="flex flex-shrink-0 items-center gap-1 overflow-x-auto md:block md:w-48"
        >
          <UHorizontalNavigation
            class="ms-6 block md:hidden"
            :links="links[0]"
          />
          <UVerticalNavigation class="mb-6 hidden md:block" :links />

          <slot name="sidebar" />
        </aside>
        <div class="flex-1 px-6 md:px-0">
          <slot />
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>
