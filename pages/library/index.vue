<script setup lang="ts">
import { Collections, type UsersResponse } from "@/types/pb";

const { $pb } = useNuxtApp();

const { data } = await useAsyncData(() =>
  $pb
    .collection(Collections.Collections)
    .getFirstListItem(
      `owner = '${
        ($pb.authStore.model! as UsersResponse).id
      }' && default = true`,
    ),
);

if (!data.value) throw createError({ statusCode: 404 });

await navigateTo(`/library/${data.value.id}`);

definePageMeta({
  middleware: "auth",
});
</script>
