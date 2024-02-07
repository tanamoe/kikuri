<script setup lang="ts">
const toast = useToast();
const { t } = useI18n({ useScope: "global" });
const { pending, remove } = useCollectionBooks();

const emit = defineEmits<{
  update: [boolean];
}>();

defineExpose({
  open,
  close,
});

const isOpen = ref(false);
const book = ref<{
  id?: string;
  name?: string;
}>({});
const state = ref<{ collection?: string }>({});

function open(
  data: {
    id: string;
    name: string;
  },
  value: {
    collection: string;
  },
) {
  isOpen.value = true;
  book.value = data;
  state.value = value;
}

function close() {
  isOpen.value = false;
}

async function onSubmit() {
  if (!book.value.id || !state.value.collection) return;

  const [res, error] = await remove(state.value.collection, book.value.id);

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
      name: book.value.name,
    }),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  emit("update", res);
  return close();
}
</script>

<template>
  <UModal v-if="$pb.authStore.isAuthRecord && book" v-model="isOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.remove") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="close"
          />
        </div>
      </template>

      <div class="space-y-3">
        <div>
          {{ $t("library.confirmRemoveBook", { name: book.name }) }}
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="close">
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
