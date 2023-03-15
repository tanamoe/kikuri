<script setup lang="ts">
import { createPopper } from "@popperjs/core";
import { TransitionRoot } from "@headlessui/vue";

const content = ref();
const tooltip = ref();
const show = ref(false);

let showTooltip: () => void;
let hideTooltip: () => void;

onMounted(() => {
  const instance = createPopper(content.value, tooltip.value, {
    placement: "right-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 24],
        },
      },
    ],
  });

  showTooltip = () => {
    show.value = true;
    instance.update();
  };

  hideTooltip = () => {
    show.value = false;
  };
});
</script>

<template>
  <div ref="content" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot name="main" />
  </div>
  <div ref="tooltip" class="z-10" role="tooltip">
    <TransitionRoot
      :show="show"
      enter="transition-opacity duration-75"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity duration-150"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <slot name="popover" />
    </TransitionRoot>
  </div>
</template>
