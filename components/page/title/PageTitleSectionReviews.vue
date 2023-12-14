<script setup lang="ts">
import { type ReviewsResponse, type UsersResponse } from "@/types/pb";

defineProps<{
  reviews: ReviewsResponse<{
    user: UsersResponse;
  }>[];
}>();
</script>

<template>
  <div>
    <AppH3 class="mb-3 mt-12">{{ $t("general.review") }}</AppH3>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <template v-for="review in reviews" :key="review.id">
        <AppReview :review="review" :user="review.expand?.user" />
      </template>
    </div>
  </div>
</template>
