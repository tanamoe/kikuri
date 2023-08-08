<script setup lang="ts">
import type { UsersResponse } from "@/types/pb";

defineProps<{
  user: UsersResponse;
}>();
</script>

<template>
  <div>
    <NuxtImg
      v-if="user.banner"
      class="aspect-[21/9] h-auto w-full rounded-md object-cover"
      :src="getPockerBaseImagePath(user, user.banner)"
      sizes="sm:90vw md:70vw lg:40vw"
    />
    <div
      v-else
      class="aspect-[21/9] h-full w-full rounded-md bg-gray-300 dark:bg-gray-700"
    />
    <div class="relative -mt-16 ml-4 w-fit">
      <img
        v-if="!user.avatar"
        class="aspect-square h-32 w-32 rounded-full border-4 border-gray-100 object-cover dark:border-gray-800"
        src="/avatar.jpg"
      />
      <NuxtImg
        v-else
        class="aspect-square h-32 w-32 rounded-full border-4 border-gray-100 object-cover dark:border-gray-800"
        width="128px"
        height="128px"
        :src="getPockerBaseImagePath(user, user.avatar)"
      />
    </div>
    <div class="space-y-3 p-4">
      <div>
        <h4 class="text-xl font-bold">{{ user.displayName }}</h4>
        <h5 class="text-gray-500 dark:text-gray-400">{{ user.username }}</h5>
      </div>
      <div v-if="user.bio" class="prose prose-sm dark:prose-invert">
        <p>{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>
