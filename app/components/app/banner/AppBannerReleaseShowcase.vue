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

const ui = {
  base: "overflow-hidden",
  body: { base: "relative", padding: "p-0 sm:p-0" },
};
</script>

<template>
  <UCard :ui>
    <div class="space-y-1">
      <div
        v-if="format || release.digital || partner || publisher"
        class="flex flex-wrap items-center gap-1"
      >
        <UBadge v-if="format" color="gray">
          {{ format.name }}
        </UBadge>
        <UBadge v-if="release.digital" color="red">Digital</UBadge>
        <UBadge v-if="partner" color="gray">
          <AppPublisher :publisher="partner" />
        </UBadge>
        <UBadge v-if="publisher" color="gray">
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
      :src="front && $pb.files.getUrl(front, front.image)"
      :srcset="front && front.resizedImage"
    />
  </UCard>
</template>
