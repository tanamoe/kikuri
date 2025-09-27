<script setup lang="ts">
import type {
  AssetsResponse,
  FormatsResponse,
  PublishersResponse,
  ReleasesResponse,
  TitlesResponse,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";

defineProps<{
  release: ReleasesResponse;
  title: TitlesResponse;
  format?: FormatsResponse;
  publisher?: PublishersResponse;
  partner?: PublishersResponse;
  front?: AssetsResponse<MetadataImages>;
}>();
</script>

<template>
  <UCard>
    <div class="space-y-1">
      <div
        v-if="format || release.digital || partner || publisher"
        class="flex flex-wrap items-center gap-1"
      >
        <UBadge v-if="format" color="secondary">
          {{ format.name }}
        </UBadge>
        <UBadge v-if="release.digital" color="error">Digital</UBadge>
        <UBadge v-if="partner" color="secondary">
          <AppPublisher :publisher="partner" />
        </UBadge>
        <UBadge v-if="publisher" color="secondary">
          <AppPublisher :publisher />
        </UBadge>
      </div>

      <h3
        class="decoration-primary-400 font-condensed line-clamp-4 text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
      >
        {{ release.name }}
      </h3>

      <div v-if="release.disambiguation">{{ release.disambiguation }}</div>

      <p v-if="title?.description" class="prose prose-sm dark:prose-invert">
        {{ title.description }}
      </p>
    </div>

    <AppImageCover
      :src="front && $pb.files.getURL(front, front.image)"
      :srcset="front && front.resizedImage"
    />
  </UCard>
</template>
