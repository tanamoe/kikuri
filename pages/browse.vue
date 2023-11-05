<script setup lang="ts">
import { joinURL } from "ufo";
import {
  Collections,
  type FormatsResponse,
  type PublishersResponse,
  type ReleaseDetailsResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { MetadataCommon } from "@/types/common";

type ResponseType = ReleaseDetailsResponse<
  MetadataCommon,
  {
    title: TitlesResponse<
      MetadataCommon,
      {
        format: FormatsResponse;
      }
    >;
    publisher: PublishersResponse;
  }
>;

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const {
  public: { ogUrl },
} = useRuntimeConfig();
const store = useBrowseStore();
const { page, query, sort } = storeToRefs(store);

const toolbar = ref<HTMLElement>();

const filter = computed(() => {
  let q = `title.name ~ '${store.query}'`;

  if (store.publishers.length > 0) {
    q += ` && (${store.publishers
      .reduce((a, v) => {
        if (v) a.push(`publisher.slug = '${v}'`);
        return a;
      }, [] as string[])
      .join(" || ")})`;
  }

  if (store.formats.length > 0) {
    q += ` && (${store.formats
      .filter((format) => format)
      .reduce((a, v) => {
        if (v) a.push(`title.format.slug = '${v}'`);
        return a;
      }, [] as string[])
      .join(" || ")})`;
  }

  if (store.demographics.length > 0) {
    q += ` && (${store.demographics
      .reduce((a, v) => {
        if (v) a.push(`title.demographic.slug = '${v}'`);
        return a;
      }, [] as string[])
      .join(" || ")})`;
  }

  if (store.status.length > 0) {
    q += ` && (${store.status
      .reduce((a, v) => {
        if (v) a.push(`status = '${v}'`);
        return a;
      }, [] as string[])
      .join(" || ")})`;
  }

  if (store.genres.length > 0) {
    q += ` && (${store.genres
      .reduce((a, v) => {
        if (v) a.push(`title.genres.slug ?= '${v}'`);
        return a;
      }, [] as string[])
      .join(" || ")})`;
  }

  return q;
});

const {
  data: releases,
  pending,
  execute,
} = await useAsyncData(
  () =>
    $pb
      .collection(Collections.ReleaseDetails)
      .getList<ResponseType>(page.value, 24, {
        filter: filter.value,
        expand: "title,title.format,publisher",
        sort: sort.value,
      }),
  {
    watch: [page, sort],
  },
);

watchDebounced(query, () => execute(), { debounce: 500 });

watch([releases], () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

useSeoMeta({
  title: t("general.browse"),
  description: t("seo.browseDescription"),
  ogTitle: t("general.browse"),
  ogDescription: t("seo.browseDescription"),
  ogImage: joinURL(ogUrl, "browse"),
  ogImageAlt: t("general.browse"),
});
</script>

<template>
  <div>
    <AppH1 class="mb-6">{{ $t("general.browse") }}</AppH1>

    <div ref="toolbar" class="space-y-6">
      <UInput
        v-model="query"
        size="lg"
        icon="i-fluent-search-24-filled"
        :placeholder="$t('general.searchPlaceholder')"
      />
      <div class="flex justify-between gap-3">
        <PageBrowseFilter @change="execute" />
        <PageBrowseSort />
      </div>
    </div>

    <div
      v-if="pending"
      class="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:grid-cols-6"
    >
      <div v-for="i in 24" :key="i">
        <USkeleton class="aspect-[2/3] h-full w-full" />
      </div>
    </div>

    <div
      v-else-if="releases && releases.totalItems == 0"
      class="mt-6 flex items-center justify-center"
    >
      <div class="text-center">
        <p>{{ "~(>_<~)" }}</p>
        <h2 class="my-3 font-lexend text-4xl font-bold">
          {{ $t("general.empty") }}
        </h2>
        <p>
          {{ $t("general.emptyMessage") }}
        </p>
      </div>
    </div>

    <div
      v-else-if="releases"
      class="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:grid-cols-6"
    >
      <div v-for="release in releases.items" :key="release.id">
        <AppTitle
          v-if="release.expand?.title"
          :title="release.expand.title"
          :src="
            release.metadata && !Array.isArray(release.metadata.images)
              ? release.metadata.images['1920w']
              : undefined
          "
          :srcset="
            release.metadata && !Array.isArray(release.metadata.images)
              ? release.metadata.images
              : undefined
          "
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
        >
          <template #before>
            <UBadge
              v-if="release.expand.title.expand"
              color="gray"
              class="mb-1 mr-1"
            >
              {{ release.expand.title.expand.format.name }}
            </UBadge>
            <UBadge color="gray" class="mb-1 mr-1">
              <div class="flex items-center gap-1">
                {{ release.expand.publisher.name }}
              </div>
            </UBadge>
          </template>
          <template #after>
            <span class="text-gray-500 dark:text-gray-400">
              {{ release.name }}
            </span>
          </template>
        </AppTitle>
      </div>
    </div>

    <div class="mt-12 flex justify-center">
      <UPagination
        v-if="releases"
        v-model="page"
        :page-count="24"
        :total="releases.totalItems"
      />
    </div>
  </div>
</template>
