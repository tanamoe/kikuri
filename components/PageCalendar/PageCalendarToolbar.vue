<script setup lang="ts">
import dayjs, { type Dayjs } from "dayjs";
import type { FilterPublishers } from "@/types/calendarFilter";

const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();

const toolbar = ref<HTMLDivElement>();
const toolbarLogo = ref<HTMLDivElement>();

const { data: publisherOptions } = useAsyncData(
  () => $pb.collection("publisher").getFullList(),
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

onMounted(() => {
  document.documentElement.style.setProperty(
    "--toolbar-logo-size",
    `${toolbarLogo.value?.clientWidth}px`
  );

  window.addEventListener("scroll", () => {
    if (toolbar.value?.getBoundingClientRect().y === 0)
      toolbar.value.classList.add("toolbar__sticky");
    else toolbar.value?.classList.remove("toolbar__sticky");
  });
});
</script>

<template>
  <div ref="toolbar" class="sticky top-0 z-10 mb-3 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-6 py-3">
      <div
        class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div class="toolbar--main flex items-center gap-3">
          <div
            ref="toolbarLogo"
            class="toolbar--logo flex items-center gap-3 text-gray-500"
          >
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
          <UButton
            color="gray"
            icon="i-fluent-more-vertical-20-filled"
            square
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --toolbar-logo-size: 4rem;
}

.toolbar--logo {
  opacity: 0;
  visibility: hidden;
  transition: all 200ms ease;
}

.toolbar__sticky .toolbar--logo {
  visibility: visible;
  opacity: 1;
}

.toolbar--main {
  transition: transform 200ms ease;
  transform: translateX(calc(var(--toolbar-logo-size) * -1 - 0.75rem));
}

.toolbar__sticky .toolbar--main {
  transform: translateX(0);
}
</style>
