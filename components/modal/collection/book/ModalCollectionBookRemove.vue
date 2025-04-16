<script setup lang="ts">
const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { pending, remove } = useCollectionBooks();

const props = defineProps<{
  book: {
    id: string;
    name: string;
  };
  collection: string;
  callback?: () => unknown;
}>();

const emit = defineEmits<{
  close: [];
}>();

const s = ref({
  collection: props.collection,
});

async function onSubmit() {
  const [, error] = await remove(s.value.collection, props.book.id);

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
    description: t("library.removeBookSuccessful", {
      name: props.book.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });

  if (props.callback) {
    props.callback();
  }
  emit("close");
}
</script>

<template>
  <UModal v-if="$pb.authStore.record && book" :title="t('library.remove')">
    <template #body>
      <div class="space-y-6">
        <div>
          {{ $t("library.confirmRemoveBook", { name: book.name }) }}
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="error" variant="ghost" @click="$emit('close')">
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
