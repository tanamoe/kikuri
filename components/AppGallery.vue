<script setup lang="ts">
import { joinURL } from "ufo";

const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  modelValue: boolean;
  currentIndex: number;
  images: string[];
}>();

const emit = defineEmits<{
  "update:modelValue": [boolean];
  "update:currentIndex": [number];
}>();

const modal = ref<HTMLElement>();
const transitionName = ref<"slide-rtl" | "slide-ltr">("slide-rtl");

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const currentIndex = computed({
  get: () => props.currentIndex,
  set: (value) => emit("update:currentIndex", value),
});

const ui = {
  inner: "fixed inset-0",
  container: "flex items-center justify-center h-screen",
  base: "h-auto",
  width: "w-fit",
  background: "",
  padding: "p-6",
  rounded: "",
  overlay: {
    background: "bg-black/80 backdrop-blur",
  },
  transition: {
    enter: "ease-out duration-200 delay-200",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "ease-in-out duration-300",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
  },
};

function handlePrev() {
  transitionName.value = "slide-ltr";
  if (currentIndex.value - 1 >= 0) currentIndex.value--;
  else currentIndex.value = props.images.length - 1;
}

function handleNext() {
  transitionName.value = "slide-rtl";
  if (currentIndex.value + 1 < props.images.length) currentIndex.value++;
  else currentIndex.value = 0;
}

const { direction } = usePointerSwipe(modal, {
  onSwipeEnd: () => {
    if (direction.value === "right") handlePrev();
    else if (direction.value === "left") handleNext();
  },
});

defineShortcuts({
  arrowleft: {
    handler: handlePrev,
  },
  arrowright: {
    handler: handleNext,
  },
});
</script>

<template>
  <UModal v-model="isOpen" :ui="ui">
    <div class="fixed right-3 top-3 flex gap-3">
      <UButton
        icon="i-fluent-arrow-download-20-filled"
        color="gray"
        square
        :to="
          joinURL(
            runtimeConfig.public.pocketbaseUrl,
            '/api/files',
            images[currentIndex],
            '?download=1',
          )
        "
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
      @click="handlePrev"
    />
    <UButton
      class="fixed right-3 top-1/2 z-10 -translate-y-1/2 transform"
      icon="i-fluent-chevron-right-20-filled"
      color="gray"
      size="md"
      square
      @click="handleNext"
    />
    <Transition
      mode="out-in"
      :name="transitionName"
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
    >
      <NuxtImg
        ref="modal"
        :key="currentIndex"
        provider="pocketbase"
        :src="images[currentIndex]"
        class="h-full max-h-[80vh] w-auto rounded-md"
        draggable="false"
      />
    </Transition>
  </UModal>
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
