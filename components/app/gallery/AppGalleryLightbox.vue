<script setup lang="ts">
import { joinURL } from "ufo";
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const store = useGalleryStore();
const { prev, next } = store;
const { isOpen, images, currentIndex, transitionName } = storeToRefs(store);

const modal = ref<HTMLElement>();

const { direction } = usePointerSwipe(modal, {
  onSwipeEnd: () => {
    if (direction.value === "right") prev();
    else if (direction.value === "left") next();
  },
});

defineShortcuts({
  arrowleft: {
    handler: prev,
  },
  arrowright: {
    handler: next,
  },
});
</script>

<template>
  <TransitionRoot
    v-if="images"
    :show="isOpen"
    as="template"
    enter="duration-300 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <Dialog class="relative z-50" @close="isOpen = false">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/90" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="ease-out duration-200 delay-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 flex w-screen items-center justify-center p-6"
        >
          <DialogPanel>
            <div class="fixed right-3 top-3 flex gap-3">
              <UButton
                icon="i-fluent-arrow-download-20-filled"
                color="gray"
                square
                :to="joinURL(images[currentIndex].src, '?download=1')"
              >
                {{ $t("general.download") }}
              </UButton>
              <UButton
                icon="i-fluent-dismiss-20-filled"
                color="gray"
                square
                @click="isOpen = false"
              />
            </div>

            <UButton
              class="fixed left-3 top-1/2 z-10 -translate-y-1/2 transform"
              icon="i-fluent-chevron-left-20-filled"
              color="gray"
              size="md"
              square
              @click="prev"
            />
            <UButton
              class="fixed right-3 top-1/2 z-10 -translate-y-1/2 transform"
              icon="i-fluent-chevron-right-20-filled"
              color="gray"
              size="md"
              square
              @click="next"
            />

            <Transition
              mode="out-in"
              :name="transitionName"
              enter-active-class="transition-all duration-200"
              leave-active-class="transition-all duration-200"
            >
              <AppGalleryImage :key="currentIndex" ref="modal" />
            </Transition>
          </DialogPanel>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<style>
.slide-rtl-enter-from {
  @apply translate-x-3 opacity-0;
}

.slide-rtl-leave-to {
  @apply -translate-x-3 opacity-0;
}

.slide-rtl-enter-to,
.slide-rtl-leave-from,
.slide-ltr-enter-to,
.slide-ltr-leave-from {
  @apply translate-x-0 opacity-100;
}

.slide-ltr-enter-from {
  @apply -translate-x-3 opacity-0;
}

.slide-ltr-leave-to {
  @apply translate-x-3 opacity-0;
}
</style>
