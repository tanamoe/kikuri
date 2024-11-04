<script setup lang="ts">
import {
  Collections,
  type AssetsResponse,
  type FormatsResponse,
  type PublishersResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });

const page = useRouteQuery("p", "1", { transform: Number });
const perPage = useRouteQuery("limit", "24", { transform: Number });
const sort = useRouteQuery("s", "-created");

const { data: publisher } = await useLazyAsyncData(() =>
  $pb
    .collection(Collections.Publishers)
    .getFirstListItem<PublishersResponse>(
      $pb.filter("slug = {:slug}", { slug: route.params.slug }),
    ),
);

const { data: releases } = await useAsyncData(
  () =>
    $pb.collection(Collections.Releases).getList<
      ReleasesResponse<{
        title: TitlesResponse<
          unknown,
          {
            format: FormatsResponse;
          }
        >;
        front: AssetsResponse<MetadataImages>;
      }>
    >(page.value, perPage.value, {
      filter: $pb.filter("publisher.slug = {:slug} || partner.slug = {:slug}", {
        slug: route.params.slug,
      }),
      expand: "front, title.format",
      sort: sort.value,
    }),
  { watch: [page, perPage, sort] },
);

if (!publisher.value)
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFoundMessage"),
  });

watch(page, () => window.scrollTo({ top: 0, behavior: "smooth" }));

const options = computed(() => [
  {
    id: "-created",
    label: t("sort.latest"),
  },
  {
    id: "+created",
    label: t("sort.oldest"),
  },
  {
    id: "+name",
    label: t("sort.nameAscending"),
  },
  {
    id: "-name",
    label: t("sort.nameDescending"),
  },
]);

useSeoMeta({
  title: publisher.value.name,
  ogTitle: publisher.value.name,
});
</script>

<template>
  <div v-if="publisher">
    <AppH1 class="mb-6">{{ publisher.name }}</AppH1>

    <div v-if="releases && releases.items.length > 0" class="space-y-6">
      <div class="flex justify-end">
        <USelectMenu
          v-model="sort"
          :options
          :ui-menu="{
            width: 'w-48',
          }"
          value-attribute="id"
        >
          <UButton
            color="gray"
            class="flex-1 justify-between"
            icon="i-fluent-arrow-sort-down-lines-20-filled"
          >
            {{ $t("general.sort") }}
          </UButton>
        </USelectMenu>
      </div>

      <AppGrid>
        <template v-for="release in releases.items" :key="release.id">
          <AppRelease
            v-if="release.expand?.title"
            :release
            :title="release.expand.title"
            :format="release.expand.title.expand?.format"
            :image="release.expand.front"
            sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, (max-width: 1280px) 15vw, 10vw"
          >
          </AppRelease>
        </template>
      </AppGrid>

      <UPagination
        v-model="page"
        class="justify-center"
        size="sm"
        :page-count="releases.perPage"
        :total="releases.totalItems"
        show-last
        show-first
      />
    </div>
  </div>
</template>
