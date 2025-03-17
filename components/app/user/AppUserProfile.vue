<script setup lang="ts">
import type { UsersResponse } from "@/types/pb";

defineProps<{
  user: UsersResponse;
}>();
</script>

<template>
  <div>
    <img
      v-if="user.banner"
      class="aspect-[21/9] h-auto w-full rounded-md object-cover"
      :src="$pb.files.getURL(user, user.banner)"
    />
    <div
      v-else
      class="aspect-[21/9] h-full w-full rounded-md bg-neutral-300 dark:bg-neutral-700"
    />
    <div class="relative -mt-16 ml-4 w-fit">
      <img
        v-if="!user.avatar"
        class="aspect-square h-32 w-32 rounded-full border-4 border-neutral-100 object-cover dark:border-neutral-800"
        src="/avatar.jpg"
      />
      <img
        v-else
        class="aspect-square h-32 w-32 rounded-full border-4 border-neutral-100 object-cover dark:border-neutral-800"
        :src="$pb.files.getURL(user, user.avatar, { thumb: '128x128' })"
      />
    </div>
    <div class="space-y-3 p-4">
      <div>
        <h4 class="text-xl font-bold">{{ user.displayName }}</h4>
        <h5 class="text-neutral-500 dark:text-neutral-400">
          {{ user.username }}
        </h5>
      </div>
      <div v-if="user.bio" class="prose prose-sm dark:prose-invert">
        <p>{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>
