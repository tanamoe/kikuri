<script setup lang="ts">
import type { PublishersResponse, ReleasesResponse } from "@/types/pb";

const props = defineProps<{
  releases: ReleasesResponse<{
    publisher: PublishersResponse;
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
  <div v-if="releases && releases.length > 0">
    <AppH3 class="mb-3 mt-12">{{ $t("general.releaseCalendar") }}</AppH3>
    <UAccordion :items="items" multiple>
      <template #default="{ item, open }">
        <UButton color="gray" variant="ghost">
          <template #leading>
            <img
              :src="
                $pb.files.getUrl(item.publisher, item.publisher.logo, {
                  thumb: '24x24',
                })
              "
              class="h-5 w-5 rounded"
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
  </div>
</template>
