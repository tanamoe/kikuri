<script setup lang="ts">
const { isOpen, book, add } = useLibraryPrompt();
const { isAuthenticated } = useAuthentication();
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="isOpen.quickAdd">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.addToLibrary") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="isOpen.quickAdd = false"
          />
        </div>
      </template>
      <div class="space-y-3">
        <UButton block>{{ $t("library.addQuick") }}</UButton>
        <UButton color="gray" block @click="add(book)">
          {{ $t("library.addManual") }}
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>
