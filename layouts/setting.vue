<script setup lang="ts">
const route = useRoute();
const { t } = useI18n({ useScope: "global" });

const sticky = computed(() => route.meta.stickyNav as boolean);

const links = computed(() => [
  [
    {
      authenticated: true,
      label: t("settings.profile"),
      to: "/settings/profile",
      icon: "i-fluent-contact-card-20-filled",
    },
  ],
  [
    {
      authenticated: undefined,
      label: t("settings.interface"),
      to: "/settings/interface",
      icon: "i-fluent-card-ui-20-filled",
    },
    {
      authenticated: true,
      label: t("settings.library"),
      to: "/settings/library",
      icon: "i-fluent-library-20-filled",
    },
  ],
  [
    {
      authenticated: true,
      label: t("settings.account"),
      to: "/settings/account",
      icon: "i-fluent-person-20-filled",
    },
    {
      authenticated: true,
      label: t("settings.email"),
      to: "/settings/email",
      icon: "i-fluent-mail-20-filled",
    },
    {
      authenticated: true,
      label: t("settings.password"),
      to: "/settings/password",
      icon: "i-fluent-password-20-filled",
    },
  ],
]);
</script>

<template>
  <div>
    <NavigationBar :sticky="sticky" />
    <main class="container mx-auto min-h-[80vh] overflow-x-hidden px-6 pb-6">
      <AppH1 class="mb-6">{{ $t("general.settings") }}</AppH1>
      <div class="flex flex-col gap-6 sm:flex-row">
        <AppSideNavigation :links="links" class="sm:w-48" />
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </main>
    <TheFooter />
    <SearchBar />
  </div>
</template>
