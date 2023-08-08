<script setup lang="ts">
import { joinURL } from "ufo";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const { t } = useI18n({ useScope: "global" });
const store = useUserStore();
const runtimeConfig = useRuntimeConfig();

const { isAuthenticated, currentUser } = storeToRefs(store);

const avatar = computed(() => {
  if (currentUser.value)
    if (currentUser.value.avatar !== "")
      return joinURL(
        runtimeConfig.public.pocketbase_url,
        "/api/files",
        getPockerBaseImagePath(currentUser.value, currentUser.value.avatar),
        "?thumb=24x24"
      );
    else return "/avatar.jpg";
});

const items = computed(() => {
  if (isAuthenticated.value === true)
    return [
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
            navigateTo("/");
          },
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
      v-if="isAuthenticated === true"
      color="gray"
      variant="ghost"
      square
    >
      <UAvatar :src="avatar" size="xs" />
    </UButton>
    <UButton
      v-else
      icon="i-fluent-person-20-filled"
      color="gray"
      square
      variant="ghost"
    />
  </UDropdown>
</template>
