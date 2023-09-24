<script setup lang="ts">
import type { FormatResponse, TitleResponse } from "@/types/pb";

defineProps<{
  title: TitleResponse<
    {},
    {
      format: FormatResponse;
    }
  >;
}>();

const isOpen = ref(false);
</script>

<template>
  <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
    <div class="z-20 -mt-24 flex-1 sm:mt-0">
      <div class="space-y-3">
        <UBadge v-if="title.expand?.format">
          {{ title.expand.format.name }}
        </UBadge>
        <AppH2>{{ title.name }}</AppH2>
      </div>

      <div v-if="title.description !== ''" class="mt-3 flex flex-col">
        <div
          class="prose prose-sm line-clamp-4 max-w-none dark:prose-invert prose-p:inline"
          v-html="title.description"
        />
        <div
          class="-mt-12 flex h-12 cursor-pointer items-end justify-center bg-gradient-to-t from-gray-50 to-transparent text-center text-sm dark:from-gray-900"
          @click="isOpen = true"
        >
          {{ $t("general.readMore") }}
        </div>
        <UModal v-model="isOpen">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                {{ $t("general.synopsis") }}

                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-fluent-dismiss-20-filled"
                  class="-my-1"
                  @click="isOpen = false"
                />
              </div>
            </template>

            <div
              class="prose prose-sm dark:prose-invert"
              v-html="title.description"
            />
          </UCard>
        </UModal>
      </div>
    </div>
    <div class="relative ml-auto w-64 flex-shrink-0">
      <div
        class="absolute inset-0 z-10 bg-gradient-to-t from-gray-50 to-transparent to-50% dark:from-gray-900 sm:hidden"
      />
      <AppCover
        class="rounded-lg"
        :book="title"
        :file-name="title.cover"
        sizes="sm:80vw md:300px"
      />
    </div>
  </header>
</template>
