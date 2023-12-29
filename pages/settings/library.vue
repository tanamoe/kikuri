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
    <UFormGroup
      name="defaultCollection"
      :label="$t('settings.defaultCollection')"
    >
      <USelectMenu
        v-model="store.library.defaultLibraryId"
        :options="c"
        :disabled="collections.length == 0"
        value-attribute="id"
        option-attribute="name"
      >
        <template #label>
          <span v-if="selectedCollection">{{ selectedCollection.name }}</span>
          <span v-else>
            {{ $t("settings.selectDefaultCollection") }}
          </span>
        </template>
      </USelectMenu>
      <div class="mt-3 text-right">
        <UButton
          v-if="selectedCollection"
          color="gray"
          @click="store.library.defaultLibraryId = undefined"
        >
          {{ $t("general.clear") }}
        </UButton>
      </div>
    </UFormGroup>
  </form>
</template>
