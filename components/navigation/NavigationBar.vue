<script setup lang="ts">
const { t } = useI18n({ useScope: "global" });
const { open } = useLibraryCollectionCreate();
const { isAuthenticated } = useAuthentication();
const settingsStore = useSettingsStore();

const firstCollection = computed(() => {
  if (!isAuthenticated.value) {
    return "/login";
  }

  if (settingsStore.library.defaultLibraryId) {
    return `/library/${settingsStore.library.defaultLibraryId}`;
  }
});

const links = computed(() => [
  {
    label: t("general.releaseCalendar"),
    to: "/calendar",
  },
  {
    label: t("general.browse"),
    to: "/browse",
  },
  {
    label: t("general.library"),
    badge: t("general.new"),
    to: firstCollection.value ? firstCollection.value : undefined,
    click: !firstCollection.value ? open : undefined,
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
    class="top-0 z-30 bg-gray-50 dark:bg-gray-900"
    :class="{
      'sticky mb-6': sticky,
    }"
  >
    <div
      class="container mx-auto grid grid-cols-2 items-center px-6 py-3 lg:grid-cols-6"
    >
      <div class="flex items-center justify-start gap-3">
        <div class="block lg:hidden">
          <NavigationSidebar />
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
          <UBadge variant="soft" size="xs" class="invisible sm:visible">
            Preview
          </UBadge>
        </ULink>
      </div>

      <ul class="col-span-4 hidden items-center justify-center gap-3 lg:flex">
        <li v-for="link in links" :key="link.to">
          <UChip
            v-if="link.badge"
            size="xs"
            position="top-right"
            inset
            :ui="{ base: '-mx-5 rounded-none ring-0', background: '' }"
          >
            <UButton
              color="gray"
              variant="ghost"
              active-class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
              :to="link.to"
              @click="link.click"
            >
              {{ link.label }}
            </UButton>

            <template #content>
              <UBadge size="xs">{{ link.badge }}</UBadge>
            </template>
          </UChip>
          <UButton
            v-else
            color="gray"
            variant="ghost"
            active-class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
            :to="link.to"
            @click="link.click"
          >
            {{ link.label }}
          </UButton>
        </li>
      </ul>

      <div class="flex items-center justify-end gap-3 whitespace-nowrap">
        <SearchButton />
        <UButton
          class="sm:hidden"
          color="gray"
          variant="ghost"
          icon="i-fluent-calendar-20-filled"
          to="/calendar"
          square
          :aria-label="$t('general.releaseCalendar')"
        />
        <NavigationUser />
      </div>
    </div>
  </nav>
</template>
