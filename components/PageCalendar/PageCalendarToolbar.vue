<script setup lang="ts">
import dayjs, { type Dayjs } from "dayjs";
import type { FilterPublishers } from "@/types/calendarFilter";
import { Collections, PublisherResponse } from "@/types/pb";

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
          src: `${runtimeConfig.public.image_endpoint}/${publisher.collectionId}/${publisher.id}/${publisher.logo}`,
        },
      })),
  }
);

defineProps<{
  month: Dayjs;
  publishers: FilterPublishers[];
}>();

defineEmits<{
  updateMonth: [month: Dayjs];
  updatePublishers: [publishers: FilterPublishers[]];
}>();
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
                @click="$emit('updateMonth', dayjs(month).subtract(1, 'month'))"
              />
              <UButton
                icon="i-fluent-chevron-right-20-filled"
                color="gray"
                variant="ghost"
                square
                @click="$emit('updateMonth', dayjs(month).add(1, 'month'))"
              />
            </div>
          </div>

          <AppMonthPicker
            :month="month.toDate()"
            @update-month="(month) => $emit('updateMonth', dayjs(month))"
          />
        </div>

        <div class="flex gap-3">
          <USelectMenu
            v-if="publisherOptions"
            :model-value="publishers"
            :options="publisherOptions"
            multiple
            @update:model-value="(p) => $emit('updatePublishers', p)"
          >
            <UButton
              color="gray"
              icon="i-fluent-building-20-filled"
              trailing-icon="i-fluent-chevron-down-20-filled"
              class="w-max"
              block
            >
              <span>{{ $t("calendar.publishers") }}</span>
              <span
                v-if="publishers.length"
                class="text-gray-500 dark:text-gray-400"
              >
                ({{ publishers.length }})
              </span>
            </UButton>
          </USelectMenu>
          <PageCalendarOptions />
        </div>
      </div>
    </div>
  </div>
</template>
