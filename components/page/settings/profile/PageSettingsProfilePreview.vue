<script setup lang="ts">
import type { UsersResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const form = ref<HTMLFormElement>();
const avatarInput = ref<HTMLInputElement>();
const bannerInput = ref<HTMLInputElement>();

const props = defineProps<{
  user: UsersResponse;
}>();

const emit = defineEmits<{
  "change:avatar": [File | string];
  "change:banner": [File | string];
}>();

const items = computed(() => [
  [
    {
      label: t("account.removeAvatar"),
      click: handleAvatarRemove,
    },
    {
      label: t("account.removeBanner"),
      click: handleBannerRemove,
    },
  ],
]);

const state = ref({
  avatar: props.user.avatar
    ? $pb.getFileUrl(props.user, props.user.avatar, { thumb: "128x128" })
    : "/avatar.jpg",
  banner: props.user.banner
    ? $pb.getFileUrl(props.user, props.user.banner)
    : "/banner.jpg",
});

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};

function handleAvatarChange() {
  if (avatarInput.value?.files) {
    emit("change:avatar", avatarInput.value.files[0]);
    state.value.avatar = window.URL.createObjectURL(avatarInput.value.files[0]);
  }
}

function handleBannerChange() {
  if (bannerInput.value?.files) {
    emit("change:banner", bannerInput.value.files[0]);
    state.value.banner = window.URL.createObjectURL(bannerInput.value.files[0]);
  }
}

function handleAvatarRemove() {
  emit("change:avatar", "");
  state.value.avatar = "/avatar.jpg";
}

function handleBannerRemove() {
  emit("change:banner", "");
  state.value.banner = "/banner.jpg";
}
</script>

<template>
  <UCard :ui="ui" class="w-full lg:max-w-sm" :hoverable="false">
    <div>
      <img
        class="aspect-[21/9] h-auto w-full cursor-pointer bg-gray-300 object-cover transition-all hover:brightness-90 dark:bg-gray-700 dark:hover:brightness-75"
        :src="state.banner"
        @click="bannerInput?.click()"
      />
      <img
        class="relative -mt-16 ml-4 aspect-square h-32 w-32 cursor-pointer rounded-full border-4 border-gray-200 object-cover transition-all hover:brightness-90 dark:border-gray-800 dark:hover:brightness-75"
        width="128px"
        height="128px"
        :src="state.avatar"
        @click="avatarInput?.click()"
      />
      <div class="relative p-4">
        <UDropdown
          class="absolute -top-12 right-4"
          :items="items"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="gray"
            variant="ghost"
            trailing-icon="i-fluent-more-vertical-20-filled"
          />
        </UDropdown>
        <div>
          <h4 class="text-xl font-bold">{{ user.displayName }}</h4>
          <h5 class="text-gray-500 dark:text-gray-400">
            {{ user.username }}
          </h5>
        </div>
        <div v-if="user.bio" class="prose prose-sm mt-3 dark:prose-invert">
          <p>{{ user.bio }}</p>
        </div>
      </div>
    </div>
  </UCard>

  <form ref="form" class="hidden">
    <input
      ref="avatarInput"
      name="avatar"
      type="file"
      accept="image/*"
      @change="handleAvatarChange"
    />
    <input
      ref="bannerInput"
      name="banner"
      type="file"
      accept="image/*"
      @change="handleBannerChange"
    />
  </form>
</template>
