<script setup lang="ts">
/* eslint-disable vue/no-v-html */
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const { share, isSupported: shareSupported } = useShare();
const { copy, copied, isSupported: clipboardSupported } = useClipboard();

const synopsisOpen = ref(false);

const { data: title } = await useAsyncData(() =>
  getTitle(route.params.id as string),
);
if (!title.value) throw createError({ statusCode: 404 });

const { data: works } = await useAsyncData(() => getWorks(title.value!.id));

const { data: releases } = await useAsyncData(() =>
  getReleases(title.value!.id),
);

const { data: images } = await useAsyncData(() =>
  getTitleCoverImages(title.value!.id),
);

function startShare() {
  share({ title: title.value!.name, url: location.href });
}

function copyLink() {
  copy(location.href);
}

const ogImage = new URL("/title", runtimeConfig.public.ogUrl);
ogImage.searchParams.set("name", title.value.name);
ogImage.searchParams.set("format", title.value.expand!.format.name);
if (title.value.cover)
  ogImage.searchParams.set(
    "image",
    $pb.files.getUrl(title.value, title.value.cover),
  );

useSeoMeta({
  title: title.value.name,
  description: title.value.description.replace(/<[^>]*>/g, ""),
  ogTitle: title.value.name,
  ogDescription: title.value.description.replace(/<[^>]*>/g, ""),
  ogImage: ogImage.toString(),
  ogImageAlt: title.value.name,
});

definePageMeta({
  layout: "full",
});
</script>

<template>
  <UContainer v-if="title">
    <header class="flex flex-col-reverse gap-6 sm:flex-row sm:items-end">
      <div class="z-20 -mt-24 flex-1 sm:mt-0">
        <div class="space-y-3">
          <UBadge>{{ title.expand?.format.name }}</UBadge>
          <AppH2>{{ title.name }}</AppH2>
        </div>

        <div v-if="title.description !== ''" class="mt-3 flex flex-col">
          <div
            class="prose prose-sm line-clamp-4 max-w-none dark:prose-invert prose-p:inline"
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
                <div class="flex items-center justify-between">
                  {{ $t("general.synopsis") }}

                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-fluent-dismiss-20-filled"
                    class="-my-1"
                    @click="synopsisOpen = false"
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

    <div class="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
      <div class="flex-1">
        <div v-if="releases">
          <AppH3 class="mb-3 mt-12">{{ $t("general.releaseCalendar") }}</AppH3>
          <PageTitleReleases :releases="releases" />
        </div>

        <div v-if="images">
          <AppH3 class="mb-3 mt-12">{{ $t("general.coverImages") }}</AppH3>
          <PageTitleCoverImages :images="images" />
        </div>
      </div>

      <div class="w-full flex-shrink-0 space-y-6 lg:w-64">
        <div class="flex gap-3">
          <UButton class="flex-1" block disabled>
            {{ $t("general.follow") }}
          </UButton>
          <UButton
            v-if="shareSupported"
            icon="i-fluent-share-ios-20-regular"
            color="gray"
            square
            @click="startShare"
          />
          <UButton
            v-else-if="clipboardSupported"
            :icon="
              copied
                ? 'i-fluent-checkmark-20-filled'
                : 'i-fluent-link-square-20-filled'
            "
            color="gray"
            square
            @click="copyLink"
          />
        </div>
        <UCard
          v-if="works && works.length > 0"
          class=""
          :ui="{
            body: {
              base: 'space-y-3 prose prose-sm dark:prose-invert prose-a:no-underline hover:prose-a:text-tanablue-500 dark:hover:prose-a:text-tanablue-400 prose-a:text-gray-800 dark:prose-a:text-gray-300',
              padding: 'px-4 py-3',
            },
          }"
        >
          <div v-for="work in works" :key="work.id">
            <div class="font-bold">{{ work.name }}</div>
            <ULink :to="'/staff/' + work.staff">
              {{ work.expand!.staff.name }}
            </ULink>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
