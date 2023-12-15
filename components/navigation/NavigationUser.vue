<script setup lang="ts">
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const { isAuthenticated, currentUser, logout } = useAuthentication();

const avatar = computed(() => {
  return currentUser.value?.avatar !== ""
    ? $pb.files.getUrl(currentUser.value!, currentUser.value!.avatar, {
        thumb: "32x32",
      })
    : "/avatar.jpg";
});

const authenticatedItems = computed(() => [
  [
    {
      label: t("account.profile"),
      avatar: {
        src: avatar.value,
      },
      to: currentUser.value
        ? joinURL("/user", currentUser.value.username)
        : undefined,
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
      click: logout,
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

const ui = {
  container: "z-50",
};
</script>

<template>
  <UDropdown
    v-if="isAuthenticated"
    :items="authenticatedItems"
    :popper="{ placement: 'bottom-end' }"
    :ui="ui"
  >
    <UButton
      color="gray"
      variant="ghost"
      square
      :aria-label="$t('general.user')"
    >
      <UAvatar :src="avatar" size="2xs" />
    </UButton>
  </UDropdown>

  <UDropdown
    v-else
    :items="items"
    :popper="{ placement: 'bottom-end' }"
    :ui="ui"
  >
    <UButton
      icon="i-fluent-person-20-filled"
      color="gray"
      square
      variant="ghost"
      :aria-label="$t('general.user')"
    />
  </UDropdown>
</template>
