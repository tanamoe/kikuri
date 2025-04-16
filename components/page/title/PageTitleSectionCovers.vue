<script setup lang="ts">
import type {
  AssetsResponse,
  BooksResponse,
  PublicationsResponse,
  ReleasesResponse,
  PublishersResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";

const props = defineProps<{
  titleId: string;
  releases: ReleasesResponse<{
    publisher: PublishersResponse;
  }>[];
  assets: AssetsResponse<
    MetadataImages,
    {
      book: BooksResponse<
        unknown,
        {
          publication: PublicationsResponse;
        }
      >;
    }
  >[];
}>();

const { $pb } = useNuxtApp();

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

const _items = computed(() =>
  props.assets
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
    <div class="mt-12 mb-3 flex items-center justify-between">
      <AppH2>{{ $t("general.coverImages") }}</AppH2>
      <USelectMenu
        v-slot="{ open }"
        v-model="selected"
        :options="releases"
        value-key="id"
        multiple
        :ui-menu="{
          width: 'w-fit',
        }"
      >
        <UButton color="neutral" class="w-max" block>
          <UIcon name="i-fluent-book-20-filled" />
          <span v-if="selected.length == 0">
            {{ $t("general.releaseSelect") }}</span
          >
          <span v-else>{{ $t("general.releaseCount", selected.length) }}</span>
          <UIcon
            name="i-fluent-chevron-right-20-filled"
            class="h-5 w-5 text-neutral-400 transition-transform dark:text-neutral-500"
            :class="[open && 'rotate-90 transform']"
          />
        </UButton>
      </USelectMenu>
    </div>
  </div>
</template>
