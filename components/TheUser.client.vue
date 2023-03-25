<script setup lang="ts">
// TODO: redesign user popover
import { createPopper } from "@popperjs/core";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const button = ref(null);
const popover = ref(null);

watchEffect(() => {
  if (button.value && popover.value) {
    createPopper(button.value, popover.value, {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 12],
          },
        },
      ],
    });
  }
});
</script>

<template>
  <Popover class="relative">
    <div ref="button">
      <PopoverButton
        class="flex h-6 w-6 items-center justify-center text-2xl dark:text-zinc-400"
      >
        <Icon name="bi:person-circle" />
      </PopoverButton>
    </div>

    <div ref="popover">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <PopoverPanel
          class="z-10 w-max max-w-sm overflow-hidden rounded-xl bg-zinc-200 shadow-md dark:bg-zinc-700"
        >
          <AppButtonLink
            href="/login"
            class="hover:bg-zinc-300 hover:dark:bg-zinc-600"
          >
            <Icon name="bi:box-arrow-in-right"></Icon> Đăng nhập
          </AppButtonLink>

          <AppButtonLink
            href="/register"
            class="hover:bg-zinc-300 hover:dark:bg-zinc-600"
          >
            <Icon name="bi:person-plus"></Icon> Đăng ký
          </AppButtonLink>

          <AppButtonLink
            href="/logout"
            class="hover:bg-zinc-300 hover:dark:bg-zinc-600"
          >
            <Icon name="bi:arrow-bar-right"></Icon> Đăng xuất
          </AppButtonLink>
        </PopoverPanel>
      </Transition>
    </div>
  </Popover>
</template>
