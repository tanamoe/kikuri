<script setup lang="ts">
import type { Record } from "pocketbase";

const runtimeConfig = useRuntimeConfig();

defineProps<{
  user: Partial<Record>;
}>();
</script>

<template>
  <div>
    <img
      v-if="user.banner"
      class="aspect-[21/9] h-auto w-full rounded-lg object-cover"
      :src="`${runtimeConfig.public.image_endpoint}/${user.collectionId}/${user.id}/${user.banner}?thumb=420x180`"
    />
    <div
      v-else
      class="aspect-[21/9] h-full w-full rounded-lg bg-gray-300 dark:bg-gray-700"
    />
    <div class="relative -mt-16 ml-4 w-fit">
      <UAvatar
        size="profile"
        :src="
          user.avatar != ''
            ? `${runtimeConfig.public.image_endpoint}/${user.collectionId}/${user.id}/${user.avatar}?thumb=256x256`
            : '/avatar.jpg'
        "
        :ui="{
          rounded: 'ring-4 ring-gray-200 dark:ring-gray-800 rounded-full',
        }"
      />
    </div>
    <div class="space-y-3 p-4">
      <div>
        <h4 class="text-xl font-bold">{{ user.displayName }}</h4>
        <h5 class="text-gray-500 dark:text-gray-400">{{ user.username }}</h5>
      </div>
      <div v-if="user.bio">
        <p class="text-gray-500 dark:text-gray-400">{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>
