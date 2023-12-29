<script setup lang="ts">
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const avatar = computed(() => {
  if ($pb.authStore.model && $pb.authStore.model.avatar !== "") {
    return $pb.files.getUrl($pb.authStore.model, $pb.authStore.model.avatar, {
      thumb: "32x32",
    });
  }

  return "/avatar.jpg";
});

const authenticatedItems = computed(() => [
  [
    {
      label: t("account.profile"),
      avatar: {
        src: avatar.value,
      },
      to: $pb.authStore.model
        ? joinURL("/user", $pb.authStore.model.username)
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
      to: "/logout",
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
    v-if="$pb.authStore.isAuthRecord"
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
