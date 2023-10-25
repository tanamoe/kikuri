<script setup lang="ts">
const { t } = useI18n({ useScope: "global" });

const links = computed(() => [
  {
    label: t("general.releaseCalendar"),
    to: "/calendar",
  },
  {
    label: t("general.browse"),
    to: "/title",
  },
  {
    label: t("general.library"),
    to: "/library",
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
        <ULink to="/" class="flex items-center gap-2">
          <img src="/logo.svg" class="h-6" />
          <UBadge variant="soft" size="xs" class="invisible sm:visible">
            Preview
          </UBadge>
        </ULink>
      </div>

      <ul class="col-span-4 hidden items-center justify-center gap-3 lg:flex">
        <li v-for="link in links" :key="link.to">
          <ULink
            class="rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-200 dark:text-gray-400 hover:dark:bg-gray-800"
            active-class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
            :to="link.to"
          >
            {{ link.label }}
          </ULink>
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
        />
        <NavigationUser />
      </div>
    </div>
  </nav>
</template>
