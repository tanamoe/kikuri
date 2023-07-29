<script setup lang="ts">
/* eslint-disable vue/no-v-html */
const route = useRoute();

const synopsisOpen = ref(false);

const title = await useTitle(route.params.id as string);
const releases = await useTitleReleases(title.id);

definePageMeta({
  layout: "full",
});
</script>

<template>
  <UContainer>
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-20 -mt-24 flex-1 sm:mt-0">
        <div class="space-y-3">
          <UBadge>{{ title.expand?.format.name }}</UBadge>
          <AppH2>{{ title.name }}</AppH2>
        </div>

        <div v-if="title.description !== ''" class="mt-3 flex flex-col">
          <div
            class="prose prose-sm line-clamp-4 max-w-none dark:prose-invert"
            v-html="title.description"
          />
          <div
            class="-mt-12 flex h-12 cursor-pointer items-end justify-center bg-gradient-to-t from-gray-50 to-transparent text-center text-sm dark:from-gray-900"
            @click="synopsisOpen = true"
          >
            {{ $t("general.readMore") }}
          </div>
          <UModal v-model="synopsisOpen">
            <UCard>
              <template #header>
                {{ $t("general.synopsis") }}
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
        <AppCover class="rounded-lg" :book="title" :src="title.cover" />
      </div>
    </header>

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <AppH3 class="mb-3 mt-12">{{ $t("general.releaseCalendar") }}</AppH3>
        <PageTitleReleases :releases="releases" />

        <AppH3 class="mb-3 mt-12">{{ $t("general.coverImages") }}</AppH3>
        <PageTitleCoverImages :title-id="title.id" />
      </div>

      <div class="w-full flex-shrink-0 lg:w-64">
        <div class="flex gap-3">
          <UButton class="flex-1" block disabled>
            {{ $t("general.follow") }}
          </UButton>
          <UButton
            icon="i-fluent-share-ios-20-regular"
            color="gray"
            square
            disabled
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
