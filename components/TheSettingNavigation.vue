<script setup lang="ts">
const { t } = useI18n({ useScope: "global" });
const { isAuthenticated } = useAuthentication();

const links = computed(() => [
  [
    {
      authenticated: true,
      label: t("settings.profile"),
      to: "/settings/profile",
    },
  ],
  [
    {
      authenticated: undefined,
      label: t("settings.interface"),
      to: "/settings/interface",
    },
  ],
  [
    {
      authenticated: true,
      label: t("settings.account"),
      to: "/settings/account",
    },
    {
      authenticated: true,
      label: t("settings.password"),
      to: "/settings/password",
    },
  ],
]);
</script>

<template>
  <div class="flex gap-2 overflow-x-scroll whitespace-nowrap sm:flex-col">
    <div v-for="(group, i) in links" :key="i" class="flex gap-1 sm:flex-col">
      <template v-for="link in group" :key="link.to">
        <ULink
          v-if="
            link.authenticated ? link.authenticated == isAuthenticated : true
          "
          class="block w-full rounded-md px-3 py-1.5 text-sm text-gray-600 transition-all hover:bg-gray-200 dark:text-gray-400 hover:dark:bg-gray-800"
          active-class="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100"
          :to="link.to"
        >
          {{ link.label }}
        </ULink>
      </template>
    </div>
  </div>
</template>
