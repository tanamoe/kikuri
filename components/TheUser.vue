<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const { t } = useI18n({ useScope: "global" });
const user = useUserStore();

const items = computed(() => {
  if (user.isAuthenticated)
    return [
      [
        {
          label: t("account.profile"),
          avatar: {
            src: "https://avatars.githubusercontent.com/u/739984?v=4",
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
          to: "/logout",
        },
      ],
    ];
  else
    return [
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
    ];
});
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <UButton
      icon="i-fluent-person-20-filled"
      color="gray"
      square
      variant="ghost"
    />
  </UDropdown>
</template>
