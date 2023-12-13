<script setup lang="ts">
import { z } from "zod";
import type {
  BreadcrumbLink,
  FormSubmitEvent,
} from "@nuxt/ui/dist/runtime/types";
import { CollectionsVisibilityOptions } from "@/types/pb";

const { t } = useI18n({ useScope: "global" });
const { currentUser } = useAuthentication();

const links = computed<BreadcrumbLink[]>(() => [
  {
    label: currentUser.value!.displayName || currentUser.value!.username,
    to: `/user/${currentUser.value!.id}`,
  },
  {
    label: t("general.library"),
    to: `/library`,
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

async function onSubmit(data: FormSubmitEvent<Schema>) {}

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <PageLibrary>
    <template #aside>
      <PageLibraryAside />
    </template>

    <UBreadcrumb class="mb-3" :links="links" />

    <AppH1 class="mb-6">{{ $t("library.createCollection") }}</AppH1>
    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col-reverse gap-6 sm:flex-row"
      @submit="onSubmit"
    >
      <div class="flex-1">
        <UFormGroup name="header" class="mb-6">
          <UInput
            v-model="state.name"
            name="name"
            :placeholder="$t('library.collectionName')"
          />
        </UFormGroup>
        <UFormGroup name="visibility" class="mb-6"> </UFormGroup>
        <ClientOnly>
          <AppEditor v-model="content" class="mb-6" />
        </ClientOnly>
      </div>
    </UForm>
  </PageLibrary>
</template>
