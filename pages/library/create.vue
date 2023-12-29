<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type {
  BreadcrumbLink,
  FormSubmitEvent,
} from "@nuxt/ui/dist/runtime/types";
import { CollectionsVisibilityOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { collectionVisibility } = useOptions();
const { update } = useLibrary();
const { pending, create } = useLibraryCollection();

const links = computed<BreadcrumbLink[]>(() => [
  {
    label: $pb.authStore.model!.displayName || $pb.authStore.model!.username,
    to: `/user/${$pb.authStore.model!.username}`,
  },
  {
    label: t("general.library"),
  },
]);

const schema = z.object({
  name: z.string().min(1, t("error.review.releaseInvalid")),
  visibility: z.nativeEnum(CollectionsVisibilityOptions),
});
type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  name: undefined,
  visibility: undefined,
});
const content = ref("");

const currentVisibility = computed(() =>
  collectionVisibility.value.find((v) => v.id === state.value.visibility),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const res = await create({
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
  title: t("seo.collectionTitleCreate"),
  ogTitle: t("seo.collectionTitleCreate"),
});
</script>

<template>
  <div>
    <UBreadcrumb class="mb-3" :links="links" />

    <AppH1 class="mb-6">{{ $t("library.createCollection") }}</AppH1>
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
          {{ $t("general.create") }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
