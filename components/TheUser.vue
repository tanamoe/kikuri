<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const { t } = useI18n({ useScope: "global" });
const store = useUserStore();
const runtimeConfig = useRuntimeConfig();

const user = storeToRefs(store);

const items = computed(() => {
  if (user.isAuthenticated.value)
    return [
      [
        {
          label: t("account.profile"),
          avatar: {
            src:
              user.currentUser.value!.avatar !== ""
                ? `${runtimeConfig.public.image_endpoint}/${
                    user.currentUser.value!.collectionId
                  }/${user.currentUser.value!.id}/${
                    user.currentUser.value!.avatar
                  }`
                : "/avatar.jpg",
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
      [
        {
          label: t("general.settings"),
          icon: "i-fluent-settings-20-filled",
          to: "/settings",
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
