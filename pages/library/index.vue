<script setup lang="ts">
import type { UserCollectionsResponse } from "@/types/collections";

const { $pb } = useNuxtApp();

const { data } = await useAsyncData(() =>
  $pb.send<UserCollectionsResponse>("/api/user-collections", {
    method: "GET",
  }),
);

if (!data.value) throw createError({ statusCode: 404 });

if (data.value.totalItems === 0) {
  await navigateTo("/library/create", {
    replace: true,
  });
} else {
  await navigateTo(`/library/${data.value.items[0]?.collectionId}`, {
    replace: true,
  });
}

definePageMeta({
  middleware: "auth",
});
</script>
