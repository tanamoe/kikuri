<script setup lang="ts">
const { quickPromptOpen, book, open } = useLibraryPrompt();
const { isAuthenticated } = useAuthentication();
</script>

<template>
  <UModal v-if="isAuthenticated && book" v-model="quickPromptOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          {{ $t("library.addToLibrary") }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-dismiss-20-filled"
            class="-my-1"
            @click="quickPromptOpen = false"
          />
        </div>
      </template>
      <div class="space-y-3">
        <UButton block>{{ $t("library.addQuick") }}</UButton>
        <UButton color="gray" block @click="open(book)">
          {{ $t("library.addManual") }}
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>
