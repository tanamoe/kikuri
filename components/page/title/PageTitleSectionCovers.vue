<script setup lang="ts">
import {
  type AssetsResponse,
  Collections,
  type BooksResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type PublishersResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";

const props = defineProps<{
  titleId: string;
  releases: ReleasesResponse<{
    publisher: PublishersResponse;
  }>[];
}>();

const { $pb } = useNuxtApp();

const { data } = await useAsyncData(() =>
  $pb.collection(Collections.Assets).getFullList<
    AssetsResponse<
      MetadataImages,
      {
        book: BooksResponse<
          unknown,
          {
            publication: PublicationsResponse;
          }
        >;
      }
    >
  >({
    filter: props.releases
      .map((release) => `book.publication.release = "${release.id}"`)
      .join(" || "),
    sort: "+book.publication.volume,+book.publication.release,+priority",
    expand: "book.publication",
    fields:
      "id,collectionId,image,resizedImage,expand.book.expand.publication.name,expand.book.expand.publication.release",
  }),
);

const releases = computed(() =>
  props.releases.map((release) => ({
    id: release.id,
    label: release.name,
    avatar: {
      src:
        release.expand?.publisher &&
        $pb.files.getUrl(
          release.expand.publisher,
          release.expand.publisher.logo,
          {
            thumb: "24x24",
          },
        ),
    },
  })),
);

const selected = ref<string[]>(releases.value.map((release) => release.id));

const images = computed(() =>
  data.value
    ?.filter((asset) =>
      asset.expand?.book.expand?.publication
        ? selected.value.includes(asset.expand.book.expand.publication.release)
        : true,
    )
    .map((asset) => ({
      alt: asset.expand?.book.expand?.publication.name ?? "",
      src: $pb.files.getUrl(asset, asset.image),
      srcset: asset.resizedImage ? joinSrcset(asset.resizedImage) : undefined,
    })),
);
</script>

<template>
  <div>
    <div class="mb-3 mt-12 flex items-center justify-between">
      <AppH3 class="">{{ $t("general.coverImages") }}</AppH3>
      <USelectMenu
        v-slot="{ open }"
        v-model="selected"
        :options="releases"
        option-attribute="label"
        value-attribute="id"
        multiple
        :ui-menu="{
          width: 'w-fit',
        }"
      >
        <UButton color="gray" class="w-max" block>
          <UIcon name="i-fluent-book-20-filled" />
          <span v-if="selected.length == 0">
            {{ $t("general.releaseSelect") }}</span
          >
          <span v-else>{{ $t("general.releaseCount", selected.length) }}</span>
          <UIcon
            name="i-fluent-chevron-right-20-filled"
            class="h-5 w-5 text-gray-400 transition-transform dark:text-gray-500"
            :class="[open && 'rotate-90 transform']"
          />
        </UButton>
      </USelectMenu>
    </div>

    <AppGallery v-if="images && images.length > 0" :items="images" />
  </div>
</template>
