<script setup lang="ts">
import type { ReviewsResponse, UsersResponse } from "@/types/pb";

defineProps<{
  reviews: ReviewsResponse<{
    user: UsersResponse;
  }>[];
}>();
</script>

<template>
  <div>
    <AppH2 class="mt-12 mb-3">{{ $t("general.review") }}</AppH2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <template v-for="review in reviews" :key="review.id">
        <AppReview :review="review" :user="review.expand?.user" />
      </template>
    </div>
  </div>
</template>
