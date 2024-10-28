<script setup lang="ts">
import type { Dayjs } from "dayjs";
import { Collections, type PublishersResponse } from "@/types/pb";

const { $pb } = useNuxtApp();

defineProps<{
  pending: boolean;
}>();

const month = defineModel<Dayjs>("month", { required: true });
const publishers = defineModel<FilterPublishers[]>("publishers", {
  required: true,
});

const { data: publisherOptions } = await useAsyncData(
  () =>
    $pb.collection(Collections.Publishers).getFullList<PublishersResponse>(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        id: publisher.id,
        label: publisher.name,
        avatar: publisher.logo
          ? {
              src: $pb.files.getUrl(publisher, publisher.logo, {
                thumb: "24x24",
              }),
            }
          : undefined,
      })),
  },
);

const toolbar = ref<HTMLDivElement>();

const ui = {
  progress: {
    rounded: "rounded-none [&::-webkit-progress-bar]:rounded-none",
    bar: "[&::-webkit-progress-value]:rounded-none [&::-moz-progress-bar]:rounded-none",
    indeterminate: {
      rounded:
        "indeterminate:after:rounded-none [&:indeterminate::-webkit-progress-value]:rounded-none [&:indeterminate::-moz-progress-bar]:rounded-none",
    },
  },
};

onMounted(async () => {
  await nextTick();
  if (toolbar.value)
    document.documentElement.style.setProperty(
      "--toolbar-height",
      `${toolbar.value.clientHeight}px`,
    );
});
</script>

<template>
  <div
    id="toolbar"
    ref="toolbar"
    class="sticky top-0 z-40 mb-3 bg-gray-50 dark:bg-gray-900"
  >
    <div class="container mx-auto px-6 py-3">
      <div
        class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-3 text-gray-500">
            <img
              class="h-6 w-auto"
              src="/icon.svg"
              height="24"
              width="24"
              alt="Tana.moe logo"
            />
            <UIcon name="i-fluent-slash-forward-20-filled" class="text-2xl" />
          </div>

          <div class="flex gap-1">
            <div class="flex">
              <UButton
                icon="i-fluent-chevron-left-20-filled"
                color="gray"
                variant="ghost"
                square
                @click="month = month.subtract(1, 'month')"
              />
              <UButton
                icon="i-fluent-chevron-right-20-filled"
                color="gray"
                variant="ghost"
                square
                @click="month = month.add(1, 'month')"
              />
            </div>
          </div>

          <AppMonthPicker v-model="month" />
        </div>

        <div class="flex gap-3">
          <USelectMenu
            v-if="publisherOptions"
            v-slot="{ open }"
            v-model="publishers"
            :options="publisherOptions"
            multiple
          >
            <UButton color="gray" class="w-max" block>
              <template #leading>
                <UAvatarGroup
                  v-if="publishers.length"
                  size="2xs"
                  :max="2"
                  :ui="{ ring: 'ring-2 ring-gray-50 dark:ring-gray-800' }"
                >
                  <UAvatar
                    v-for="publisher in publishers"
                    :key="publisher.id"
                    :src="publisher.avatar?.src"
                    :alt="publisher.label"
                  />
                </UAvatarGroup>
                <UIcon v-else name="i-fluent-building-20-filled" />
              </template>
              <span>
                {{ $t("general.publisher", publishers.length) }}
              </span>
              <UIcon
                name="i-fluent-chevron-right-20-filled"
                class="h-5 w-5 text-gray-400 transition-transform dark:text-gray-500"
                :class="[open && 'rotate-90 transform']"
              />
            </UButton>
          </USelectMenu>

          <CalendarOptions />
        </div>
      </div>
    </div>
    <UProgress
      id="separator"
      class="transition-opacity"
      :animation="pending ? 'carousel' : undefined"
      :value="!pending ? 100 : undefined"
      size="xs"
      :ui
    />
  </div>
</template>
