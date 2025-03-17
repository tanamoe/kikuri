<script setup lang="ts">
import { joinURL } from "ufo";
import type {
  ReleasesResponse,
  ReviewsResponse,
  TitlesResponse,
  UsersResponse,
} from "@/types/pb";
import type { CardProps } from "@nuxt/ui";

defineProps<{
  review: ReviewsResponse;
  user?: UsersResponse;
  release?: ReleasesResponse<{
    title: TitlesResponse;
  }>;
}>();

const ui: CardProps["ui"] = { body: "relative p-0 sm:p-0" };
</script>

<template>
  <ULink :to="joinURL('/review', review.id)" class="group">
    <UCard :ui>
      <div class="relative flex">
        <div v-if="release?.expand?.title" class="w-32 flex-shrink-0">
          <img
            :src="
              $pb.files.getUrl(release.expand.title, release.expand.title.cover)
            "
            class="h-full w-full object-cover transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
          />
        </div>
        <div class="space-y-4 p-4">
          <div class="prose prose-sm dark:prose-invert">
            <h3 v-if="release" class="font-condensed">
              {{ release.expand?.title.name }} - {{ release.name }}
            </h3>
            <h4
              class="decoration-primary-400 decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
            >
              {{ review.header }}
            </h4>
            <p>
              {{ review.content }}
            </p>
          </div>

          <div
            v-if="user"
            class="flex items-center justify-between gap-2 overflow-hidden"
          >
            <div class="flex items-center gap-2">
              <UAvatar
                size="xs"
                :src="
                  $pb.files.getUrl(user, user.avatar, {
                    thumb: '32x32',
                  })
                "
                :alt="user.displayName || user.username"
              />
              <span
                class="overflow-hidden text-sm text-ellipsis whitespace-nowrap"
              >
                {{ user.displayName || user.username }}
              </span>
            </div>
            <UBadge v-if="review.score >= 7" variant="subtle">
              {{ $t("review.recommend") }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </ULink>
</template>
