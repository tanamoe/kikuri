<script setup lang="ts">
const { isOpen, book, state, updateFn } = useLibraryPrompt();
const { pending, remove } = useLibrary();
const { isAuthenticated } = useAuthentication();

const emit = defineEmits<{
  update: [void];
}>();

async function onSubmit() {
  if (!book.value || !state.value.collection) return;

  const res = await remove({
    bookId: book.value.id,
    collectionId: state.value.collection,
  });

  if (res) {
    emit("update");
    isOpen.value.remove = false;
    if (updateFn.value) updateFn.value();
  }
}
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="isOpen.remove">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.remove") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="isOpen.remove = false"
          />
        </div>
      </template>

      <div class="space-y-3">
        <div>
          {{ $t("library.confirmRemove", { name: book.name }) }}
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="red" variant="ghost" @click="isOpen.remove = false">
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
