<script setup lang="ts">
import {
  Collections,
  type CollectionsResponse,
  type UsersResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: collection } = await useAsyncData(() =>
  $pb.collection(Collections.Collections).getOne<
    CollectionsResponse<{
      owner: UsersResponse;
    }>
  >(route.params.collectionId as string, {
    expand: "owner",
  }),
);

if (!collection.value) throw createError({ statusCode: 404 });
</script>

<template>
  <div v-if="collection">
    <AppBreadcrumb
      v-if="collection.expand"
      class="mb-3"
      :items="[
        {
          label: collection.expand.owner.displayName,
          href: `/user/${collection.owner}`,
        },
        {
          label: $t('general.library'),
        },
      ]"
    />
    <AppH1 class="mb-6">{{ collection.name }}</AppH1>

    <div
      class="prose prose-sm mb-6 max-w-none dark:prose-invert"
      v-html="collection.description"
    />

    <div>
      <PageLibraryBooks :collection-id="collection.id" />
    </div>
  </div>
</template>
