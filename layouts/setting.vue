<script setup>
const { t } = useI18n({ useScope: "global" });

const general = [
  {
    label: t("settings.profile"),
    to: "/settings/profile",
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
      <AppHeading>Cài đặt</AppHeading>
      <div class="flex flex-col gap-6 sm:flex-row">
        <div
          class="flex gap-3 overflow-x-scroll whitespace-nowrap sm:w-48 sm:flex-col"
        >
          <UVerticalNavigation :links="general" />
          <hr class="dark:border-zinc-700" />
          <UVerticalNavigation :links="account" />
        </div>
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </main>
    <TheSearch />
  </div>
</template>
