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

const items = [
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
];

const state = ref({
  avatar: props.user.avatar
    ? $pb.getFileUrl(props.user, props.user.avatar)
    : "/avatar.jpg",
  banner: props.user.banner
    ? $pb.getFileUrl(props.user, props.user.banner)
    : "/banner.jpg",
});

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
  <AppCard class="w-full lg:max-w-sm" :hoverable="false">
    <div>
      <img
        class="aspect-[21/9] h-auto w-full cursor-pointer rounded-t-md bg-gray-300 object-cover hover:brightness-75 dark:bg-gray-700"
        :src="state.banner"
        @click="bannerInput?.click()"
      />
      <div class="relative -mt-16 w-full px-4">
        <img
          class="aspect-square h-32 w-32 cursor-pointer rounded-full border-4 border-gray-100 object-cover hover:brightness-75 dark:border-gray-800"
          width="128px"
          height="128px"
          :src="state.avatar"
          @click="avatarInput?.click()"
        />

        <UDropdown
          class="absolute bottom-4 right-4"
          :items="items"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-fluent-more-vertical-20-filled"
          />
        </UDropdown>
      </div>

      <div class="space-y-3 p-4">
        <div>
          <h4 class="text-xl font-bold">{{ user.displayName }}</h4>
          <h5 class="text-gray-500 dark:text-gray-400">
            {{ user.username }}
          </h5>
        </div>
        <div v-if="user.bio" class="prose prose-sm dark:prose-invert">
          <p>{{ user.bio }}</p>
        </div>
      </div>
    </div>
  </AppCard>

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
