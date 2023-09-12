<script setup lang="ts">
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { isAuthenticated, currentUser } = useAuthentication();

const avatar = computed(() => {
  return currentUser.value?.avatar !== ""
    ? $pb.files.getUrl(currentUser.value!, currentUser.value!.avatar)
    : "/avatar.jpg";
});

const authenticatedItems = computed(() => [
  [
    {
      label: t("account.profile"),
      avatar: {
        src: avatar.value,
      },
    },
  ],
  [
    {
      label: t("general.settings"),
      icon: "i-fluent-settings-20-filled",
      to: "/settings",
    },
  ],
  [
    {
      label: t("account.logout"),
      icon: "i-fluent-sign-out-20-filled",
      click: () => {
        const { $pb } = useNuxtApp();
        $pb.authStore.clear();
        return navigateTo("/");
      },
    },
  ],
]);

const items = computed(() => [
  [
    {
      label: t("account.login"),
      icon: "i-fluent-arrow-enter-20-filled",
      to: "/login",
    },
    {
      label: t("account.register"),
      icon: "i-fluent-person-add-20-filled",
      to: "/register",
    },
  ],
  [
    {
      label: t("general.settings"),
      icon: "i-fluent-settings-20-filled",
      to: "/settings",
    },
  ],
]);
</script>

<template>
  <UDropdown
    v-if="isAuthenticated"
    :items="authenticatedItems"
    :popper="{ placement: 'bottom-end' }"
    :ui="{
      container: 'z-30',
    }"
  >
    <UButton color="gray" variant="ghost" square>
      <UAvatar :src="avatar" size="2xs" />
    </UButton>
  </UDropdown>

  <UDropdown
    v-else
    :items="items"
    :popper="{ placement: 'bottom-end' }"
    :ui="{
      container: 'z-30',
    }"
  >
    <UButton
      icon="i-fluent-person-20-filled"
      color="gray"
      square
      variant="ghost"
    />
  </UDropdown>
</template>
