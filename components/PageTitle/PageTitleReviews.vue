<script setup lang="ts">
import type { ReviewResponse, UsersResponse } from "types/pb";

defineProps<{
  reviews: ReviewResponse<{
    user: UsersResponse;
  }>[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    <ULink
      v-for="review in reviews"
      :key="review.id"
      :to="'/review/' + review.id"
    >
      <UCard :ui="{ body: { base: 'relative', padding: 'px-4 py-3' } }">
        <div class="relative z-10 space-y-3">
          <h4>{{ review.header }}</h4>

          <div class="flex items-center justify-between gap-2 overflow-hidden">
            <div class="flex items-center gap-2">
              <NuxtImg
                :src="
                  getPockerBaseImagePath(
                    review.expand!.user,
                    review.expand!.user.avatar,
                  )
                "
                class="rounded-full"
                width="24"
                height="24"
              />
              <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                {{ review.expand?.user.displayName }}
              </span>
            </div>
            <UBadge v-if="review.score >= 7">
              {{ $t("review.recommend") }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </ULink>
  </div>
</template>
