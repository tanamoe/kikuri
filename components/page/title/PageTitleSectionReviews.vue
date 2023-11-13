<script setup lang="ts">
import {
  Collections,
  type ReviewsResponse,
  type UsersResponse,
} from "@/types/pb";

const props = defineProps<{
  titleId: string;
}>();

const { $pb } = useNuxtApp();

const { data: reviews } = await useAsyncData(() =>
  $pb.collection(Collections.Reviews).getFullList<
    ReviewsResponse<{
      user: UsersResponse;
    }>
  >({
    filter: `release.title='${props.titleId}'`,
    expand: "user",
  }),
);
</script>

<template>
  <div v-if="reviews && reviews.length > 0">
    <AppH3 class="mb-3 mt-12">{{ $t("general.review") }}</AppH3>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <ULink
        v-for="review in reviews"
        :key="review.id"
        :to="'/review/' + review.id"
      >
        <UCard :ui="{ body: { base: 'relative' } }">
          <div class="relative z-10 space-y-3">
            <h4>{{ review.header }}</h4>

            <div
              class="flex items-center justify-between gap-2 overflow-hidden"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="
                    $pb.files.getUrl(
                      review.expand!.user,
                      review.expand!.user.avatar,
                      {
                        thumb: '20x20',
                      },
                    )
                  "
                  class="rounded-full"
                />
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                  {{
                    review.expand?.user.displayName ||
                    review.expand?.user.username
                  }}
                </span>
              </div>
              <UBadge v-if="review.score >= 7" variant="subtle">
                {{ $t("review.recommend") }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>
  </div>
</template>
