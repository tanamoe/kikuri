<script setup lang="ts">
import { joinURL } from "ufo";
import type { PublisherResponse, ReleaseResponse } from "@/types/pb";

const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  releases: ReleaseResponse<{
    publisher: PublisherResponse;
  }>[];
}>();

const items = props.releases.map((release) => ({
  label: release.name,
  id: release.id,
  publisher: release.expand?.publisher,
  status: release.status,
}));
</script>

<template>
  <UAccordion :items="items" multiple>
    <template #default="{ item, open }">
      <UButton color="gray" variant="ghost">
        <template #leading>
          <UAvatar
            size="2xs"
            :src="
              joinURL(
                runtimeConfig.public.image_endpoint,
                usePocketbaseImage(item.publisher, item.publisher.logo)
              )
            "
          />
        </template>

        <span class="truncate">{{ item.label }}</span>
        <UBadge :color="item.status === 'CANCELLED' ? 'red' : 'primary'">
          {{ $t(`status.${(item.status as string).toLowerCase()}`) }}
        </UBadge>

        <template #trailing>
          <UIcon
            name="i-fluent-chevron-right-20-filled"
            class="ms-auto h-5 w-5 transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </template>
      </UButton>
    </template>

    <template #item="{ item, open }">
      <PageTitleReleaseDetailed :release-id="item.id" :open="open" />
    </template>
  </UAccordion>
</template>
