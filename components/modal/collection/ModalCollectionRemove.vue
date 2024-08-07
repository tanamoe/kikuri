<script setup lang="ts">
const { pending, remove } = useCollections();
const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { update } = useLibrary();
const modal = useModal();

const props = defineProps<{
  collection: {
    id: string;
    name: string;
  };
}>();

async function onSubmit() {
  const [, error] = await remove(props.collection.id);

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
    description: t("library.removeCollectionSuccess", {
      name: props.collection.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  modal.close();
  await update();
  return navigateTo("/library");
}
</script>

<template>
  <UModal>
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.removeCollection") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="modal.close"
          />
        </div>
      </template>

      <div class="space-y-3">
        <div>
          {{ $t("library.confirmRemoveCollection", { name: collection.name }) }}
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="modal.close">
            {{ $t("general.return") }}
          </UButton>
          <UButton type="submit" :loading="pending" @click="onSubmit">
            {{ $t("general.confirm") }}
          </UButton>
        </div>
      </div>
    </UCard>
  </UModal>
</template>
