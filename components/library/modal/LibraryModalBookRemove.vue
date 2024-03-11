<script setup lang="ts">
const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { pending, remove } = useCollectionBooks();
const modal = useModal();

const props = defineProps<{
  book: {
    id: string;
    name: string;
  };
  collection: string;
  callback?: () => any;
}>();

const s = ref({
  collection: props.collection,
});

function handleClose() {
  modal.isOpen.value = false;
}

async function onSubmit() {
  const [, error] = await remove(s.value.collection, props.book.id);

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
    description: t("library.removeBookSuccessful", {
      name: props.book.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });

  if (props.callback) {
    props.callback();
  }
  return handleClose();
}
</script>

<template>
  <UModal v-if="$pb.authStore.isAuthRecord && book">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.remove") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="handleClose"
          />
        </div>
      </template>

      <div class="space-y-3">
        <div>
          {{ $t("library.confirmRemoveBook", { name: book.name }) }}
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="handleClose">
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
