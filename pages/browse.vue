<script setup lang="ts">
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
      unknown,
      {
        format: FormatsResponse;
      }
    >;
    publisher: PublishersResponse;
  }
>;

const { $pb } = useNuxtApp();
const store = useAdvancedFilterStore();

const { formats, publishers } = storeToRefs(store);
const query = ref("");
const queryDebounced = refDebounced(query, 500);
const page = ref(1);

const filter = computed(() => {
  let q = `title.name ~ '${queryDebounced.value}'`;

  if (publishers.value.length > 0) {
    q += ` && (${publishers.value
      .map((publishers) => `publisher = '${publishers.id}'`)
      .join(" || ")})`;
  }

  if (formats.value.length > 0) {
    q += ` && (${formats.value
      .map((format) => `title.format = '${format.id}'`)
      .join(" || ")})`;
  }

  return q;
});
const sort = ref("-updated");

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
    watch: [queryDebounced],
  },
);
</script>

<template>
  <UContainer>
    <AppH1 class="mb-6">{{ $t("general.browse") }}</AppH1>

    <div class="space-y-6">
      <UInput
        v-model="query"
        size="lg"
        icon="i-fluent-search-24-filled"
        :placeholder="$t('general.searchPlaceholder')"
      />
      <div class="flex justify-between gap-3">
        <AppFilterAdvanced @change="execute" />
        <USelect
          class="flex-shrink-0"
          :placeholder="$t('general.sortBy')"
          icon="i-fluent-arrow-sort-down-lines-20-filled"
        />
      </div>
    </div>

    <div v-if="pending" class="mt-6 grid grid-cols-6 gap-x-6 gap-y-12">
      <div v-for="i in 24" :key="i">
        <USkeleton class="aspect-[2/3] h-full w-full" />
      </div>
    </div>

    <div
      v-else-if="releases"
      class="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:grid-cols-6"
    >
      <div v-for="release in releases.items" :key="release.id">
        <AppRelease
          :release="release"
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw"
        />
      </div>
    </div>
  </UContainer>
</template>
