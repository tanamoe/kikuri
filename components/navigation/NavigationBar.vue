<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { joinURL } from "ufo";

const { t } = useI18n({ useScope: "global" });
const library = useLibrary();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t("general.releaseCalendar"),
    to: "/calendar",
  },
  {
    label: t("general.browse"),
    to: "/browse",
    children: [
      {
        label: t("general.title"),
        to: "/browse/titles",
        icon: "i-fluent-book-20-filled",
      },
      {
        label: t("general.release"),
        to: "/browse/releases",
        icon: "i-fluent-calendar-20-filled",
      },
      {
        label: t("general.publisher"),
        to: "/browse/publishers",
        icon: "i-fluent-building-20-filled",
      },
      {
        label: t("general.staff"),
        to: "/browse/staffs",
        icon: "i-fluent-person-20-filled",
      },
    ],
  },
  {
    label: t("general.library"),
    badge: {
      label: t("general.new"),
      color: "primary",
      variant: "solid",
    },
    to: "/library",
    children: library.collections.value.map((collection) => ({
      label: collection.collection?.name,
      to: joinURL("/library", collection.collectionId),
    })),
  },
]);

withDefaults(
  defineProps<{
    sticky?: boolean;
  }>(),
  {
    sticky: true,
  },
);
</script>

<template>
  <nav
    class="bg-default/90 top-0 z-40 backdrop-blur"
    :class="{
      'sticky mb-6': sticky,
      relative: !sticky,
    }"
  >
    <UContainer
      class="mx-auto grid grid-cols-2 items-center px-6 py-3 sm:px-6 sm:py-1 lg:grid-cols-6"
    >
      <div class="flex items-center justify-start gap-3">
        <div class="block lg:hidden">
          <LazyNavigationSidebar :items />
        </div>
        <ULink
          to="/"
          class="flex items-center gap-2"
          :aria-label="$t('general.home')"
        >
          <img
            src="/logo.svg"
            class="h-6"
            width="90"
            height="24"
            alt="Tana.moe logo"
          />
        </ULink>
      </div>

      <UNavigationMenu
        :items
        class="col-span-4 hidden justify-center sm:flex"
      />

      <div class="flex items-center justify-end gap-3 whitespace-nowrap">
        <SearchButton />
        <UButton
          class="sm:hidden"
          color="neutral"
          variant="ghost"
          icon="i-fluent-calendar-20-filled"
          to="/calendar"
          square
          :aria-label="$t('general.releaseCalendar')"
        />
        <NavigationUser />
      </div>
    </UContainer>
  </nav>
</template>
