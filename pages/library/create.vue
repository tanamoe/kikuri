<script setup lang="ts">
import { z } from "zod";
import { joinURL } from "ufo";
import type { BreadcrumbLink, FormSubmitEvent } from "#ui/types";
import { CollectionsVisibilityOptions } from "@/types/pb";

const { $pb } = useNuxtApp();
const { t } = useI18n({ useScope: "global" });
const { update } = useLibrary();
const { pending, create } = useCollections();
const toast = useToast();

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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const [res, error] = await create({
    ...event.data,
    description: content.value,
  });

  if (error) {
    return toast.add({
      title: t("error.generalMessage"),
      description: error.message,
      color: "red",
      icon: "i-fluent-error-circle-20-filled",
    });
  }

  toast.add({
    title: t("general.success"),
    description: t("library.createCollectionSuccess", {
      name: res.item.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  await update();
  return navigateTo(joinURL("/library", res.item.id));
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
        <UFormGroup name="name">
          <UInput
            v-model="state.name"
            name="name"
            :placeholder="$t('library.collectionName')"
          />
        </UFormGroup>

        <UFormGroup name="visibility">
          <InputCollectionVisibility v-model="state.visibility" />
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
