<script setup lang="ts">
import { ModalCollectionBookAdd } from "#components";
import type { MetadataLibrary } from "@/types/common";

const overlay = useOverlay();
const modal = overlay.create(ModalCollectionBookAdd);

interface Props {
  id: string;
  name: string;
  square?: boolean;
  inCollections?: MetadataLibrary["inCollections"];
}

const { id, name, inCollections } = defineProps<Props>();

const emit = defineEmits<{
  add: [];
}>();

function add() {
  modal.open({
    book: {
      id: id,
      name: name,
    },
    inCollections,
    callback: () => emit("add"),
  });
}
</script>

<template>
  <div class="flex w-full items-center">
    <UPopover v-if="inCollections">
      <UTooltip :text="$t('library.view')" :popper="{ placement: 'top' }">
        <UButton icon="i-fluent-library-20-filled" v-bind="$attrs" square />
      </UTooltip>

      <template #panel>
        <UCard
          :ui="{
            body: 'p-0 sm:p-0',
            header: 'px-3 py-2 sm:px-3 sm:py-2',
          }"
        >
          <UButton
            v-for="collection in inCollections"
            :key="collection.id"
            :to="`/library/${collection.id}`"
            color="neutral"
            variant="ghost"
            block
          >
            {{ collection.name }}
          </UButton>
        </UCard>
      </template>
    </UPopover>

    <UTooltip v-if="square" :text="$t('library.addToLibrary')">
      <UButton
        icon="i-fluent-add-20-filled"
        v-bind="$attrs"
        square
        :disabled="!$pb.authStore.record"
        @click.prevent="add"
      />
    </UTooltip>

    <UButton
      v-else
      icon="i-fluent-add-20-filled"
      v-bind="$attrs"
      class="w-full flex-1"
      block
      :disabled="!$pb.authStore.record"
      @click.prevent="add"
    >
      {{ $t("library.addToLibrary") }}
    </UButton>
  </div>
</template>
