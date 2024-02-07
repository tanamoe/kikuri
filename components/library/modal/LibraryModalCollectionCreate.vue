<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { CollectionsVisibilityOptions } from "@/types/pb";

const { t } = useI18n({ useScope: "global" });
const { collectionVisibility } = useOptions();
const { update } = useLibrary();
const { isOpen, close } = useCollectionCreateModal();
const { pending, create } = useCollections();
const toast = useToast();

const schema = z.object({
  name: z.string().min(1, t("error.review.releaseInvalid")),
  visibility: z.nativeEnum(CollectionsVisibilityOptions),
});
type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({});
const content = ref("");

const currentVisibility = computed(() =>
  collectionVisibility.value.find((v) => v.id === state.value.visibility),
);

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
  return close();
}
</script>

<template>
  <UModal v-if="$pb.authStore.isAuthRecord" v-model="isOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.createCollection") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="close"
          />
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormGroup name="name">
          <UInput
            v-model="state.name"
            :placeholder="$t('library.collectionName')"
          />
        </UFormGroup>

        <UFormGroup name="visibility">
          <USelectMenu
            v-model="state.visibility"
            :options="collectionVisibility"
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

        <AppEditor v-model="content" />

        <div class="flex items-center justify-end gap-3">
          <UTooltip :text="$t('general.more')">
            <UButton
              to="/library/create"
              icon="i-fluent-more-vertical-20-filled"
              color="gray"
              variant="ghost"
              square
              @click="close"
            />
          </UTooltip>
          <UButton type="submit" :loading="pending">
            {{ $t("general.create") }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
