<script setup lang="ts">
import type { MetadataImages } from "@/types/common";
import type {
  AssetsResponse,
  LinkSourcesResponse,
  LinksResponse,
} from "@/types/pb";
import type { CardProps } from "@nuxt/ui";

defineProps<{
  assets: AssetsResponse<MetadataImages>[];
  links: LinksResponse<{ source: LinkSourcesResponse }>[];
  cols?: number;
}>();

const ui: CardProps["ui"] = {
  root: "overflow-hidden",
  body: "relative p-0 sm:p-0",
};
</script>

<template>
  <UCard :ui>
    <AppAssetsScrollingGrid :assets class="absolute inset-0" :cols />
    <div
      class="relative z-10 space-y-3 bg-gradient-to-r from-transparent via-neutral-200 via-35% to-neutral-200 p-6 pl-[calc(1.5rem_+_35%)] xl:via-65% xl:pl-[calc(1.5rem_+_65%)] dark:via-neutral-800 dark:to-neutral-800"
    >
      <AppH3>{{ $t("digital.title") }}</AppH3>
      <p>
        {{ $t("digital.description") }}
      </p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AppTitleLinkButton v-for="link in links" :key="link.id" :link />
      </div>
    </div>
  </UCard>
</template>
