<script setup lang="ts">
import { joinURL } from "ufo";

import type { MetadataCommon } from "@/types/common";
import type {
  ReleaseDetailsResponse,
  TitlesResponse,
  FormatsResponse,
  PublishersResponse,
} from "@/types/pb";

defineProps<{
  release: ReleaseDetailsResponse<
    MetadataCommon,
    {
      title: TitlesResponse<
        unknown,
        {
          format: FormatsResponse;
        }
      >;
      publisher: PublishersResponse;
    }
  >;
}>();
</script>

<template>
  <NuxtLink
    v-if="release.expand && release.expand.title.expand"
    :to="joinURL('/title/' + release.title)"
    class="group space-y-3"
  >
    <AppCard>
      <AppCover
        :name="release.expand.title.name"
        :src="
          release.metadata && !Array.isArray(release.metadata.images)
            ? release.metadata.images['1920w']
            : undefined
        "
        :srcset="
          release.metadata && !Array.isArray(release.metadata.images)
            ? release.metadata.images
            : undefined
        "
        v-bind="$attrs"
      />
    </AppCard>
    <div class="space-y-1">
      <div>
        <UBadge color="gray" class="mb-1 mr-1">
          {{ release.expand.title.expand.format.name }}
        </UBadge>
        <UBadge color="gray" class="mb-1 mr-1">
          <div class="flex items-center gap-1">
            {{ release.expand.publisher.name }}
          </div>
        </UBadge>
      </div>
      <h3
        class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ release.expand.title.name }}
      </h3>
      <h4 class="text-gray-500 dark:text-gray-400">
        {{ release.name }}
      </h4>
    </div>
  </NuxtLink>
</template>
