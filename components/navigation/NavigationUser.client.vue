<script setup lang="ts">
import type { DropdownMenuProps } from "@nuxt/ui";
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const avatar = computed(() => {
  if ($pb.authStore.record && $pb.authStore.record.avatar !== "") {
    return $pb.files.getURL($pb.authStore.record, $pb.authStore.record.avatar, {
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
      to: $pb.authStore.record
        ? joinURL("/user", $pb.authStore.record.username)
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

const ui: DropdownMenuProps<unknown>["ui"] = {
  content: "z-50",
};

const content: DropdownMenuProps<unknown>["content"] = {
  align: "end",
  side: "bottom",
};
</script>

<template>
  <UDropdownMenu
    v-if="$pb.authStore.record"
    :items="authenticatedItems"
    :popper="{ placement: 'bottom-end' }"
    :ui
    :content
  >
    <UButton
      color="neutral"
      variant="ghost"
      square
      :aria-label="$t('general.user')"
    >
      <UAvatar :src="avatar" size="2xs" />
    </UButton>
  </UDropdownMenu>

  <UDropdownMenu
    v-else
    :items="items"
    :popper="{ placement: 'bottom-end' }"
    :ui
    :content
  >
    <UButton
      icon="i-fluent-person-20-filled"
      color="neutral"
      square
      variant="ghost"
      :aria-label="$t('general.user')"
    />
  </UDropdownMenu>
</template>
