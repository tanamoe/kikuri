<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/vue";

defineProps<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>();
</script>

<template>
  <button
    class="flex h-6 w-6 items-center justify-center text-2xl"
    @click="setIsOpen(true)"
  >
    <Icon name="bi:list" />
  </button>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog @close="setIsOpen(false)">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-300 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-50 bg-black/30" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 h-screen overflow-y-auto">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="ease-in-out duration-500"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel as="template">
            <div
              class="container relative min-h-screen w-5/6 bg-zinc-800 p-6 text-zinc-200"
            >
              <div class="my-6">
                <NuxtLink to="/">kikuri</NuxtLink>
              </div>
              <ul class="font-lexend mt-12 space-y-2 text-2xl font-bold">
                <li><NuxtLink to="/">Lịch phát hành</NuxtLink></li>
                <li>Danh mục</li>
                <li>Tủ truyện</li>
              </ul>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
/* TODO: might need changes later */
.router-link-active {
  @apply text-primary;
}
</style>
