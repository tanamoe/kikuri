<script setup lang="ts">
import { joinURL } from "ufo";

const { collections } = useLibrary();
const settingsStore = useSettingsStore();

const defaultValid = computed(() => {
  return collections.value.some(
    (collection) =>
      collection.collectionId === settingsStore.library.defaultLibraryId,
  );
});

if (defaultValid.value && settingsStore.library.defaultLibraryId) {
  await navigateTo(
    joinURL("/library", settingsStore.library.defaultLibraryId),
    { replace: true },
  );
} else if (
  collections.value &&
  collections.value.length > 0 &&
  collections.value[0]?.collectionId
) {
  await navigateTo(joinURL("/library", collections.value[0].collectionId), {
    replace: true,
  });
} else {
  await navigateTo("/library/create", { replace: true });
}

definePageMeta({
  middleware: ["auth"],
});
</script>
