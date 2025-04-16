<script setup lang="ts">
const { collections } = useLibrary();
const store = useSettingsStore();

const c = computed(() =>
  collections.value.map((collection) => ({
    id: collection.collectionId,
    name: collection.collection!.name,
  })),
);

const selectedCollection = computed(() =>
  c.value.find(
    (collection) => collection.id === store.library.defaultLibraryId,
  ),
);

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>

<template>
  <form class="space-y-6">
    <UFormField
      name="defaultCollection"
      :label="$t('settings.defaultCollection')"
    >
      <USelectMenu
        v-model="store.library.defaultLibraryId"
        :items="c"
        :disabled="collections.length == 0"
        value-key="id"
        label-key="name"
        :search-input="false"
        class="w-full"
      >
        <span v-if="selectedCollection">{{ selectedCollection.name }}</span>
        <span v-else>
          {{ $t("settings.selectDefaultCollection") }}
        </span>
      </USelectMenu>
      <div class="mt-3 text-right">
        <UButton
          v-if="selectedCollection"
          color="neutral"
          @click="store.library.defaultLibraryId = undefined"
        >
          {{ $t("general.clear") }}
        </UButton>
      </div>
    </UFormField>
  </form>
</template>
