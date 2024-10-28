<script setup lang="ts">
import type {
  PublishersResponse,
  ReleasesResponse,
  TitlesResponse,
} from "@/types/pb";
import { joinURL } from "ufo";

defineProps<{
  title: TitlesResponse;
  releases: ReleasesResponse<{
    publisher: PublishersResponse;
    partner?: PublishersResponse;
  }>[];
}>();

const ui = {
  background: "dark:bg-gray-800",
  body: {
    base: "flex flex-col md:flex-row gap-3 items-center justify-between",
  },
};

const uiAvatar = {
  ring: "ring-0",
};
</script>

<template>
  <div v-if="releases && releases.length > 0">
    <AppH2 class="mb-3 mt-12">{{ $t("general.release") }}</AppH2>
    <div class="space-y-3">
      <ULink
        v-for="{
          id,
          status,
          name,
          disambiguation,
          digital,
          expand,
        } in releases"
        :key="id"
        :to="joinURL('/title', title.slug, id)"
        class="group block"
      >
        <UCard :ui>
          <div class="flex items-center gap-4 font-bold">
            <UAvatarGroup size="xs" :ui="uiAvatar">
              <UAvatar
                v-if="expand?.partner"
                :src="
                  $pb.files.getUrl(expand.partner, expand.partner.logo, {
                    thumb: '24x24',
                  })
                "
              />
              <UAvatar
                v-if="expand?.publisher"
                :src="
                  $pb.files.getUrl(expand.publisher, expand.publisher.logo, {
                    thumb: '24x24',
                  })
                "
                :alt="expand.publisher.name"
              />
            </UAvatarGroup>
            <span class="decoration-primary decoration-2 group-hover:underline">
              {{ name }}
              <span
                v-if="disambiguation"
                class="text-gray-400 dark:text-gray-500"
              >
                ({{ disambiguation }})
              </span>
            </span>
          </div>
          <div class="space-x-1">
            <UBadge v-if="digital" color="red">Digital</UBadge>
            <AppStatusBadge :status class="text-nowrap" />
          </div>
        </UCard>
      </ULink>
    </div>
  </div>
</template>
