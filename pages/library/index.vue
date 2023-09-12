<script setup lang="ts">
import { Collections, CollectionResponse, UsersResponse } from "@/types/pb";

const { $pb } = useNuxtApp();

const currentUser = ref<UsersResponse>($pb.authStore.model! as UsersResponse);

const { data } = await useAsyncData(() =>
  $pb
    .collection(Collections.Collection)
    .getFirstListItem<CollectionResponse>(
      `owner = '${currentUser.value.id}' && default = true`,
    ),
);

if (!data.value) throw createError({ statusCode: 404 });

await navigateTo(`/library/${data.value.id}`);

definePageMeta({
  middleware: "with-auth",
});
</script>
