<script setup lang="ts">
import { joinURL } from "ufo";
import dayjs, { type Dayjs } from "dayjs";
import type { FilterPublishers } from "@/utils/releases";
import { Collections, type PublisherResponse } from "@/types/pb";

const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();

const { data: publisherOptions } = useAsyncData(
  () => $pb.collection(Collections.Publisher).getFullList<PublisherResponse>(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        id: publisher.id,
        label: publisher.name,
        avatar: {
          src: joinURL(
            runtimeConfig.public.pocketbase_url,
            "/api/files",
            getPockerBaseImagePath(publisher, publisher.logo),
            "?thumb=24x24"
          ),
        },
      })),
  }
);

const props = defineProps<{
  month: Dayjs;
  publishers: FilterPublishers[];
}>();

const emit = defineEmits<{
  "update:month": [month: Dayjs];
  "update:publishers": [publishers: FilterPublishers[]];
}>();

const currentMonth = computed({
  get: () => props.month.toDate(),
  set: (value) => emit("update:month", dayjs.utc(value)),
});

const currentPublishers = computed({
  get: () => props.publishers,
  set: (value) => emit("update:publishers", value),
});
</script>

<template>
  <div class="sticky top-0 z-10 mb-3 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-6 py-3">
      <div
        class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-3 text-gray-500">
            <img class="h-6 w-auto" src="/icon.svg" />
            <UIcon name="i-fluent-slash-forward-20-filled" class="text-2xl" />
          </div>

          <div class="flex gap-1">
            <div class="flex">
              <UButton
                icon="i-fluent-chevron-left-20-filled"
                color="gray"
                variant="ghost"
                square
                @click="$emit('update:month', month.subtract(1, 'month'))"
              />
              <UButton
                icon="i-fluent-chevron-right-20-filled"
                color="gray"
                variant="ghost"
                square
                @click="$emit('update:month', month.add(1, 'month'))"
              />
            </div>
          </div>

          <AppMonthPicker v-model="currentMonth" />
        </div>

        <div class="flex gap-3">
          <USelectMenu
            v-if="publisherOptions"
            v-model="currentPublishers"
            :options="publisherOptions"
            multiple
          >
            <UButton
              color="gray"
              trailing-icon="i-fluent-chevron-down-20-filled"
              class="w-max"
              block
            >
              <template #leading>
                <UAvatarGroup
                  v-if="currentPublishers.length"
                  size="2xs"
                  :max="2"
                  :ui="{ ring: 'ring-2 ring-gray-50 dark:ring-gray-800' }"
                >
                  <UAvatar
                    v-for="publisher in currentPublishers"
                    :key="publisher.id"
                    :src="publisher.avatar.src"
                    :alt="publisher.label"
                  />
                </UAvatarGroup>
                <UIcon v-else name="i-fluent-building-20-filled" />
              </template>
              <span>
                {{ $t("general.publisher", currentPublishers.length) }}
              </span>
            </UButton>
          </USelectMenu>
          <PageCalendarOptions />
        </div>
      </div>
    </div>
  </div>
</template>
