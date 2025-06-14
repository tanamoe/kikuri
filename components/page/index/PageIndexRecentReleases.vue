<script setup lang="ts">
import type {
  ReleaseDetailsResponse,
  FormatsResponse,
  TitlesResponse,
  PublishersResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

defineProps<{
  releases: ReleaseDetailsResponse<
    MetadataCommon,
    {
      title: TitlesResponse<
        MetadataCommon,
        {
          format: FormatsResponse;
        }
      >;
      publisher: PublishersResponse;
    }
  >[];
}>();
</script>

<template>
  <div>
    <UContainer class="mb-6">
      <NuxtLink to="/browse">
        <AppH3
          class="decoration-tanablue-400 flex items-center gap-3 underline decoration-[.2rem] underline-offset-[.2rem]"
        >
          <img
            src="/icon.svg"
            class="h-6"
            height="24"
            width="24"
            alt="Tana.moe logo"
          />
          {{ $t("general.justUpdatedReleases") }}
        </AppH3>
      </NuxtLink>
    </UContainer>
    <div
      v-if="releases"
      class="mx-auto flex snap-x snap-mandatory gap-6 overflow-x-scroll sm:container sm:grid sm:grid-cols-3 sm:overflow-x-hidden sm:px-6 lg:grid-cols-6"
    >
      <div
        v-for="(release, i) in releases"
        :key="release.id"
        :class="[
          'w-1/3 flex-shrink-0 snap-start scroll-ml-6 sm:w-full',
          i === 0 && 'ml-6 sm:ml-0',
          i === releases.length - 1 && 'mr-6 sm:mr-0',
        ]"
      >
        <AppTitle
          v-if="release.expand?.title"
          :title="release.expand.title"
          :src="
            release.metadata?.images && !Array.isArray(release.metadata.images)
              ? release.metadata.images['1920w']
              : undefined
          "
          :srcset="
            release.metadata && !Array.isArray(release.metadata.images)
              ? release.metadata.images
              : undefined
          "
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
        >
          <template #before>
            <UBadge
              v-if="release.expand.title.expand"
              color="neutral"
              class="mr-1 mb-1"
            >
              {{ release.expand.title.expand.format.name }}
            </UBadge>
            <UBadge color="neutral" class="mr-1 mb-1">
              <div class="flex items-center gap-1">
                {{ release.expand.publisher.name }}
              </div>
            </UBadge>
          </template>
          <template #after>
            <span class="text-neutral-500 dark:text-neutral-400">
              {{ release.name }}
            </span>
          </template>
        </AppTitle>
      </div>
    </div>
  </div>
</template>
