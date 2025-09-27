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
  root: "dark:bg-neutral-800",
  body: "flex flex-col md:flex-row gap-3 items-center justify-between",
};
</script>

<template>
  <div v-if="releases && releases.length > 0">
    <AppH2 class="mt-12 mb-3">{{ $t("general.release") }}</AppH2>
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
            <UAvatarGroup size="xs">
              <UAvatar
                v-if="expand?.partner"
                :src="
                  $pb.files.getURL(expand.partner, expand.partner.logo, {
                    thumb: '24x24',
                  })
                "
                :alt="expand.partner.name"
              />
              <UAvatar
                v-if="expand?.publisher"
                :src="
                  $pb.files.getURL(expand.publisher, expand.publisher.logo, {
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
                class="text-neutral-400 dark:text-neutral-500"
              >
                ({{ disambiguation }})
              </span>
            </span>
          </div>
          <div class="space-x-1">
            <UBadge v-if="digital" color="error">Digital</UBadge>
            <AppStatusBadge :status class="text-nowrap" />
          </div>
        </UCard>
      </ULink>
    </div>
  </div>
</template>
