<script setup lang="ts">
import { joinURL } from "ufo";
import type { UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();
const { currentUser } = useAuthentication();
const settingsStore = useSettingsStore();

// if a default library is set
if (settingsStore.library.defaultLibraryId) {
  await navigateTo(`/library/${settingsStore.library.defaultLibraryId}`, {
    replace: true,
  });
}

const { data: collections } = await useAsyncData(() =>
  $pb.send<UserCollectionsResponse>(
    joinURL("/api/user-collections", currentUser.value!.id),
    {
      method: "GET",
    },
  ),
);

// go to create on empty
if (!collections.value || collections.value.totalItems === 0) {
  await navigateTo("/library/create", {
    replace: true,
  });
} else if (collections.value.items[0]) {
  // go to the first entry
  await navigateTo(`/library/${collections.value.items[0].collectionId}`, {
    replace: true,
  });
} else {
  throw createError({
    statusCode: 500,
    statusMessage: "Unhandled library redirect",
  });
}

definePageMeta({
  middleware: ["auth"],
});
</script>
