<script setup lang="ts">
import type { CollectionBookResponse } from "@/types/api/collections";
import { joinURL } from "ufo";

defineProps<{
  editable: boolean;
  books: CollectionBookResponse[];
}>();

defineEmits<{
  change: [];
}>();

const ui = {
  body: { base: "flex gap-3 text-sm hover:shadow-lg transition-shadow" },
};
</script>

<template>
  <div class="grid grid-cols-1 gap-6">
    <UCard v-for="item in books" :key="item.id" :ui="ui">
      <div class="w-20 md:w-16 lg:w-14 xl:w-12">
        <AppImageCover
          class="rounded"
          :name="item.book?.publication?.name"
          :src="item.book?.defaultAsset?.resizedImage?.['1920w']"
          :srcset="item.book?.defaultAsset?.resizedImage"
        />
      </div>
      <div class="w-full">
        <div v-if="editable" class="float-right flex gap-1">
          <LibraryEditButton
            :id="item.id"
            :name="item.book?.publication?.name ?? $t('general.tba')"
            :collection="item.collectionId"
            :quantity="item.quantity"
            :status="item.status"
            @change="$emit('change')"
          />
          <LibraryRemoveButton
            :id="item.id"
            :name="item.book?.publication?.name ?? $t('general.tba')"
            :collection="item.collectionId"
            @change="$emit('change')"
          />
        </div>

        <div class="space-y-2">
          <div
            v-if="
              item.book?.edition || item.book?.publication?.release?.digital
            "
          >
            <UBadge v-if="item.book?.edition" color="tanaamber">
              {{ item.book.edition }}
            </UBadge>
            <UBadge v-if="item.book?.publication?.release?.digital" color="red">
              Digital
            </UBadge>
          </div>
          <h3 class="decoration-primary font-bold hover:underline">
            <ULink
              :to="
                item.book?.publication?.release?.title?.slug &&
                joinURL('/title', item.book.publication.release.title.slug)
              "
            >
              {{ item.book?.publication?.name }}
            </ULink>
          </h3>
          <div
            v-if="item.book?.publishDate"
            class="text-gray-600 dark:text-gray-400"
          >
            {{
              $t("general.dateRelease", {
                date: $d(new Date(item.book.publishDate), "publishDate"),
              })
            }}
          </div>
          <div class="flex gap-2 text-gray-600 dark:text-gray-400">
            <div>
              {{ $t(`status.${item.status.toLowerCase()}`) }}
            </div>
            &middot;
            <div>
              <span v-if="item.book?.price">
                {{ $n(item.book.price, "currency", "vi") }}
              </span>
              &times;
              {{ item.quantity }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
