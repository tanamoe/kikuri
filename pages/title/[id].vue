<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
const route = useRoute();

const synopsisOpen = ref(false);

const { title, releases } = await useTitle(route.params.id as string);

const items = releases.map((release) => ({
  label: release.name,
  id: release.id,
  publisher: release.expand?.publisher,
  status: release.status,
}));

definePageMeta({
  layout: "full",
});
</script>

<template>
  <UContainer>
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-10 -mt-12 flex-1 sm:mt-0">
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
        <AppCard>
          <AppCover :book="title" :src="title.cover" />
        </AppCard>
      </div>
    </header>

    <div class="mt-6 flex flex-col-reverse gap-6 sm:flex-row">
      <div class="mt-12 flex-1">
        <AppH3 class="mb-3">{{ $t("general.printRelease") }}</AppH3>
        <UAccordion :items="items" multiple>
          <template #default="{ item, open }">
            <UButton color="gray" variant="ghost">
              <template #leading>
                <UAvatar
                  size="2xs"
                  :src="usePocketbaseImage(item.publisher, item.publisher.logo)"
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

      <div class="w-full flex-shrink-0 sm:w-64">
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
