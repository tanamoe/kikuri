<script setup lang="ts">
import { createPopper } from "@popperjs/core";

const content = ref();
const tooltip = ref();
const show = ref(false);

let showTooltip: () => void;
let hideTooltip: () => void;

onMounted(() => {
  const instance = createPopper(content.value, tooltip.value, {
    placement: "right-start",
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
  <div ref="tooltip" role="tooltip" :class="show ? 'block' : 'hidden'">
    <slot name="popover" />
  </div>
</template>
