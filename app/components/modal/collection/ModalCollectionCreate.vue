<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionsVisibilityOptions } from "@/types/pb";

const { t } = useI18n({ useScope: "global" });
const { update } = useLibrary();
const { pending, create } = useCollections();
const toast = useToast();

const schema = z.object({
  name: z.string().min(1, t("error.review.releaseInvalid")),
  visibility: z.nativeEnum(CollectionsVisibilityOptions),
});
type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({});
const content = ref("");

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const [res, error] = await create({
    ...event.data,
    description: content.value,
  });

  if (error) {
    toast.add({
      title: t("error.generalMessage"),
      description: error.message,
      color: "error",
      icon: "i-fluent-error-circle-20-filled",
    });
    return;
  }

  toast.add({
    title: t("general.success"),
    description: t("library.createCollectionSuccess", {
      name: res.item.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  await update();
}
</script>

<template>
  <UModal v-if="$pb.authStore.record">
    <template #header>
      <div class="flex items-center justify-between">
        {{ $t("library.createCollection") }}
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-fluent-dismiss-20-filled"
          class="-my-1"
        />
      </div>
    </template>

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField name="name">
          <UInput
            v-model="state.name"
            :placeholder="$t('library.collectionName')"
          />
        </UFormField>

        <UFormField name="visibility">
          <InputCollectionVisibility v-model="state.visibility" />
        </UFormField>

        <AppEditor v-model="content" />

        <div class="flex items-center justify-end gap-3">
          <UTooltip :text="$t('general.more')">
            <UButton
              to="/library/create"
              icon="i-fluent-more-vertical-20-filled"
              color="neutral"
              variant="ghost"
              square
            />
          </UTooltip>
          <UButton type="submit" :loading="pending">
            {{ $t("general.create") }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
