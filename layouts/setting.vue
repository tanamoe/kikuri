<script setup>
import { useUserStore } from "@/stores/user";

const { t } = useI18n({ useScope: "global" });
const { isAuthenticated } = useUserStore();

const general = [
  {
    label: t("settings.profile"),
    to: "/settings/profile",
  },
];

const site = [
  {
    label: t("settings.interface"),
    to: "/settings/interface",
  },
];

const account = [
  {
    label: t("settings.account"),
    to: "/settings/account",
  },
  {
    label: t("settings.changePassword"),
    to: "/settings/password",
  },
];
</script>

<template>
  <div>
    <TheNavigation />
    <main class="container mx-auto overflow-x-hidden px-6">
      <AppHeading class="mb-6">{{ $t("general.settings") }}</AppHeading>
      <div class="flex flex-col gap-6 sm:flex-row">
        <div
          class="flex gap-3 overflow-x-scroll whitespace-nowrap sm:w-48 sm:flex-col"
        >
          <UVerticalNavigation v-if="isAuthenticated" :links="general" />
          <hr v-if="isAuthenticated" class="dark:border-zinc-700" />
          <UVerticalNavigation :links="site" />
          <hr v-if="isAuthenticated" class="dark:border-zinc-700" />
          <UVerticalNavigation v-if="isAuthenticated" :links="account" />
        </div>
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </main>
    <TheSearch />
  </div>
</template>
