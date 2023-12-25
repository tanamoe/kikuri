<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type {
  BreadcrumbLink,
  FormSubmitEvent,
} from "@nuxt/ui/dist/runtime/types";
import { CollectionsVisibilityOptions } from "@/types/pb";
import type { UserCollectionResponse } from "@/types/collections";

const route = useRoute();
const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { collectionVisibility } = useOptions();
const { update } = useLibrary();
const { pending, edit } = useLibraryCollection();

if (!route.query.id || Array.isArray(route.query.id)) {
  throw createError({
    statusCode: 400,
    statusMessage: t("error.badRequestMessage"),
  });
}

const { data: collection } = await useAsyncData(() =>
  $pb.send<UserCollectionResponse>(`/api/user-collection/${route.query.id}`, {
    expand: "owner",
  }),
);
if (!collection.value) throw createError({ statusCode: 404 });

const links = computed<BreadcrumbLink[]>(() => [
  {
    label: $pb.authStore.model!.displayName || $pb.authStore.model!.username,
    to: collection.value?.item.owner
      ? `/user/${collection.value.item.owner.username}`
      : undefined,
  },
  {
    label: t("general.library"),
  },
  {
    label: collection.value!.item.name,
    to: joinURL("/library", collection.value!.item.id),
  },
]);

const schema = z.object({
  name: z.string().min(1, t("error.review.releaseInvalid")),
  visibility: z.nativeEnum(CollectionsVisibilityOptions),
});
type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  name: collection.value.item.name,
  visibility: collection.value.item.visibility,
});
const content = ref(collection.value.item.description);

const currentVisibility = computed(() =>
  collectionVisibility.value.find((v) => v.id === state.value.visibility),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!collection.value) return;

  const res = await edit(collection.value.item.id, {
    ...event.data,
    description: content.value,
  });

  if (res?.success) {
    await update();
    await navigateTo(joinURL("/library", res.item.id));
  }
}

definePageMeta({
  layout: "library",
  middleware: "auth",
});

useSeoMeta({
  title: t("seo.collectionTitleEdit", {
    name: collection.value.item.name,
  }),
  ogTitle: t("seo.collectionTitleEdit", {
    name: collection.value.item.name,
  }),
});
</script>

<template>
  <div>
    <UBreadcrumb class="mb-3" :links="links" />

    <AppH1 class="mb-6">{{ $t("library.editCollection") }}</AppH1>
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UFormGroup name="header">
          <UInput
            v-model="state.name"
            name="name"
            :placeholder="$t('library.collectionName')"
          />
        </UFormGroup>

        <UFormGroup name="visibility">
          <USelectMenu
            v-model="state.visibility"
            :options="collectionVisibility"
            name="visibility"
            value-attribute="id"
            option-attribute="label"
          >
            <template #label>
              <span v-if="currentVisibility">{{
                currentVisibility.label
              }}</span>
              <span v-else>{{ $t("library.selectVisibility") }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <AppEditor v-model="content" />

      <div class="text-right">
        <UButton type="submit" :loading="pending">
          {{ $t("general.save") }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
