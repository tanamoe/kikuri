<script setup lang="ts">
import type { BaseAPIResponse } from "@/types/api";

const { pending, remove } = useLibraryBook();
const { isAuthenticated } = useAuthentication();

const emit = defineEmits<{
  update: [BaseAPIResponse];
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

  const res = await remove(state.value.collection, book.value.id);

  if (res) {
    emit("update", res);
    close();
  }
}
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="isOpen">
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
