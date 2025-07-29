<script setup lang="ts">
const { pending, remove } = useCollections();
const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { update } = useLibrary();

const props = defineProps<{
  collection: {
    id: string;
    name: string;
  };
}>();

async function onSubmit() {
  const [, error] = await remove(props.collection.id);

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
    description: t("library.removeCollectionSuccess", {
      name: props.collection.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  await update();
  await navigateTo("/library");
  return;
}
</script>

<template>
  <UModal>
    <template #header>
      <div class="flex items-center justify-between">
        {{ $t("library.removeCollection") }}
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-fluent-dismiss-20-filled"
          class="-my-1"
        />
      </div>
    </template>

    <template #body>
      <div class="space-y-3">
        <div>
          {{ $t("library.confirmRemoveCollection", { name: collection.name }) }}
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="error" variant="ghost">
            {{ $t("general.return") }}
          </UButton>
          <UButton type="submit" :loading="pending" @click="onSubmit">
            {{ $t("general.confirm") }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
