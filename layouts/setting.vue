<script setup lang="ts">
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const route = useRoute();

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
    label: t("settings.password"),
    to: "/settings/password",
  },
];

const sticky = computed(() => route.meta.stickyNav as boolean);
</script>

<template>
  <div>
    <TheNavigation :sticky="sticky" />
    <main class="container mx-auto min-h-[80vh] overflow-x-hidden px-6 pb-6">
      <AppH1 class="mb-6">{{ $t("general.settings") }}</AppH1>
      <div class="flex flex-col gap-6 sm:flex-row">
        <div
          class="flex gap-3 overflow-x-scroll whitespace-nowrap sm:w-48 sm:flex-col"
        >
          <div v-if="$pb.authStore.isAuthRecord">
            <UVerticalNavigation :links="general" />
            <hr class="dark:border-gray-700" />
          </div>
          <UVerticalNavigation :links="site" />
          <div v-if="$pb.authStore.isAuthRecord">
            <UVerticalNavigation :links="account" />
          </div>
        </div>
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </main>
    <TheFooter />
    <TheSearch />
  </div>
</template>
