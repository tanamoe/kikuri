<script setup lang="ts">
import dayjs, { type Dayjs } from "dayjs";

const props = defineProps<{
  modelValue: Dayjs;
}>();

const emit = defineEmits<{
  "update:modelValue": [month: Dayjs];
}>();

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const today = dayjs.tz();

const availableYears = [
  ...Array.from(
    { length: today.year() - 2000 + 2 }, // get from 2000 to the year after now
    (_, index) => 2000 + index,
  ),
];

const selected = ref({
  year: date.value.year(),
  month: date.value.month(),
});

const reset = () => {
  selected.value = {
    year: today.year(),
    month: today.month(),
  };
};

watch(
  [date],
  () =>
    (selected.value = {
      year: date.value.year(),
      month: date.value.month(),
    }),
);
</script>

<template>
  <UPopover
    :popper="{ placement: 'bottom-start' }"
    :ui="{
      width: 'w-max max-w-xs',
      background: 'bg-white dark:bg-gray-800',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
    }"
  >
    <UButton variant="solid" icon="i-fluent-chevron-down-20-filled" trailing>
      {{ $d(modelValue.toDate(), { month: "numeric", year: "numeric" }) }}
    </UButton>

    <template #panel="{ close }">
      <div class="space-y-3 p-3">
        <USelect
          v-model="selected.year"
          color="primary"
          size="md"
          :options="availableYears"
        />
        <div class="grid grid-cols-3 gap-1">
          <template v-for="(monthName, i) in dayjs.months()" :key="i">
            <UButton
              v-if="i == selected.month"
              variant="solid"
              color="primary"
              block
              @click="selected.month = i"
            >
              {{ monthName }}
            </UButton>
            <UButton
              v-else-if="i == date.month() && selected.year == date.year()"
              variant="outline"
              color="primary"
              block
              @click="selected.month = i"
            >
              {{ monthName }}
            </UButton>
            <UButton
              v-else
              variant="ghost"
              color="gray"
              block
              :ui="{
                color: {
                  gray: {
                    ghost:
                      'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary',
                  },
                },
              }"
              @click="selected.month = i"
            >
              {{ monthName }}
            </UButton>
          </template>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <UButton color="red" variant="outline" block @click="reset">
            {{ $t("monthPicker.reset") }}
          </UButton>
          <UButton
            block
            @click="
              () => {
                close();
                date = dayjs.tz(selected);
              }
            "
          >
            {{ $t("monthPicker.save") }}
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
