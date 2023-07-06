<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const toast = cva(
  "fixed flex rounded-lg px-6 py-4 text-zinc-800 shadow max-w-full min-w-sm mx-6 bottom-6 transition-all transform translate-y-6 open:translate-y-0 open:opacity-100 opacity-0",
  {
    variants: {
      intent: {
        primary: "dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800",
        success: "bg-green-200",
        error: "bg-red-200",
        caution: "bg-orange-200",
        info: "bg-amber-200",
        none: "",
      },
    },
  }
);

type AppToastProps = VariantProps<typeof toast>;

const dialog = ref<HTMLDialogElement>();

const props = withDefaults(
  defineProps<{
    autoclose?: boolean;
    intent?: AppToastProps["intent"];
  }>(),
  {
    autoclose: true,
    intent: "primary",
  }
);

const show = () => {
  dialog.value?.show();
  if (props.autoclose === true) setTimeout(close, 3000);
};
const close = () => dialog.value?.close();

defineExpose({
  show,
  close,
});
</script>

<template>
  <dialog ref="dialog" :class="toast({ intent })">
    <p class="w-full">
      <button class="float-right ml-3" @click="close">
        <Icon name="fluent:dismiss-12-regular" />
      </button>
      <slot />
    </p>
  </dialog>
</template>
