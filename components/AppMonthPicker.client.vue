<script setup lang="ts">
import { createPopper } from "@popperjs/core";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";

interface MonthYear {
  month: number;
  year: number;
}

const props = defineProps<{
  monthYear: MonthYear;
}>();

const today = new Date();

const button = ref(null);
const popover = ref(null);

const selectedYear = ref(props.monthYear.year);
const selectedMonth = ref(props.monthYear.month);

const availableYears = [
  ...Array.from(
    { length: today.getFullYear() - 2000 + 2 }, // get from 2000 to the year after now
    (_, index) => 2000 + index
  ),
];

watchEffect(() => {
  if (button.value && popover.value) {
    createPopper(button.value, popover.value, {
      placement: "bottom-start",
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

defineEmits<{
  (e: "updateMonthYear", monthYear: MonthYear): void;
}>();
</script>

<template>
  <Popover v-slot="{ open }" class="relative inline-block">
    <div ref="button">
      <PopoverButton
        class="font-kanit flex items-center gap-3 rounded-2xl bg-zinc-200 px-2 py-1 text-2xl font-bold transition-all duration-150 ease-linear hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
      >
        {{ monthYear.month + 1 }}/{{ monthYear.year }}
        <Icon
          name="bi:chevron-down"
          :class="[{ 'rotate-180': open }, 'text-base transition-transform']"
        />
      </PopoverButton>
    </div>

    <div ref="popover" class="z-10">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          v-slot="{ close }"
          class="w-max max-w-xs overflow-hidden rounded-2xl bg-zinc-100 shadow-lg dark:bg-zinc-700"
        >
          <div class="space-y-3 p-3">
            <Listbox v-model="selectedYear">
              <ListboxButton
                class="relative w-full rounded-xl bg-zinc-200 px-2 py-1 text-lg font-bold transition-all duration-300 hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-500"
              >
                {{ selectedYear }}
                <span class="absolute inset-y-0 right-2 flex items-center">
                  <Icon name="bi:chevron-bar-expand" />
                </span>
              </ListboxButton>
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <ListboxOptions
                  class="absolute inset-x-3 mt-3 max-h-40 overflow-auto rounded-xl bg-zinc-200 dark:bg-zinc-600"
                >
                  <ListboxOption
                    v-for="availableYear in availableYears"
                    v-slot="{ active, selected }"
                    :key="availableYear"
                    :value="availableYear"
                    as="template"
                  >
                    <li
                      :class="[
                        {
                          'bg-zinc-300 dark:bg-zinc-500': active,
                          'font-bold': selected,
                        },
                        'relative w-full cursor-default px-2 py-1 text-center transition-colors',
                      ]"
                    >
                      <span
                        class="absolute inset-y-0 right-2 flex items-center"
                      >
                        <Icon v-if="selected" name="bi:check" />
                      </span>
                      {{ availableYear }}
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </Listbox>

            <div class="grid grid-cols-3 gap-1">
              <AppButton
                v-for="i in [...Array(12).keys()]"
                :key="i"
                :class="[
                  {
                    'bg-primary text-zinc-50': i == selectedMonth,
                    'hover:bg-zinc-200 dark:hover:bg-zinc-600':
                      i != selectedMonth,
                  },
                ]"
                @click="
                  {
                    selectedMonth = i;
                  }
                "
              >
                <!-- TODO: move this to hard-set month -->
                {{
                  Intl.DateTimeFormat("vi-VN", { month: "long" }).format(
                    new Date(0, i)
                  )
                }}
              </AppButton>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <AppButton
                @click="
                  {
                    selectedMonth = today.getMonth();
                    selectedYear = today.getFullYear();
                  }
                "
              >
                Tháng này
              </AppButton>
              <AppButton
                :intent="
                  selectedMonth == monthYear.month &&
                  selectedYear == monthYear.year
                    ? 'secondary'
                    : 'primary'
                "
                @click="
                  {
                    $emit('updateMonthYear', {
                      month: selectedMonth,
                      year: selectedYear,
                    });
                    close();
                  }
                "
              >
                Áp dụng
              </AppButton>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </div>
  </Popover>
</template>
