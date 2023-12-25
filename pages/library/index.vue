<script setup lang="ts">
import { joinURL } from "ufo";

const { collections } = useLibrary();
const settingsStore = useSettingsStore();

if (settingsStore.library.defaultLibraryId) {
  await navigateTo(joinURL("/library", settingsStore.library.defaultLibraryId));
}

if (collections.value && collections.value.length > 0) {
  await navigateTo(joinURL("/library", collections.value[0].collectionId));
}

definePageMeta({
  middleware: ["auth"],
});
</script>
