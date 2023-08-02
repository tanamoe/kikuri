<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps<{
  modelValue: Date;
}>();

const today = new Date();

const selectedYear = ref(props.modelValue.getFullYear());
const selectedMonth = ref(props.modelValue.getMonth());

const availableYears = [
  ...Array.from(
    { length: today.getFullYear() - 2000 + 2 }, // get from 2000 to the year after now
    (_, index) => 2000 + index
  ),
];

const reset = () => {
  selectedYear.value = today.getFullYear();
  selectedMonth.value = today.getMonth();
};

defineEmits<{
  "update:modelValue": [month: Date];
}>();
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton variant="solid" icon="i-fluent-chevron-down-20-filled" trailing>
      {{ $d(modelValue, { month: "numeric", year: "numeric" }) }}
    </UButton>

    <template #panel="{ close }">
      <div
        class="w-max max-w-xs overflow-hidden rounded-2xl bg-zinc-100 shadow-lg dark:bg-zinc-700"
      >
        <div class="space-y-3 p-3">
          <USelect
            v-model="selectedYear"
            color="primary"
            size="md"
            :options="availableYears"
          />
          <div class="grid grid-cols-3 gap-1">
            <UButton
              v-for="(monthName, i) in dayjs.months()"
              :key="i"
              :variant="
                i == selectedMonth
                  ? 'solid'
                  : i == modelValue.getMonth() &&
                    selectedYear == modelValue.getFullYear()
                  ? 'outline'
                  : 'ghost'
              "
              :color="
                i == selectedMonth ||
                (i == modelValue.getMonth() &&
                  selectedYear == modelValue.getFullYear())
                  ? 'primary'
                  : 'gray'
              "
              block
              @click="selectedMonth = i"
            >
              {{ monthName }}
            </UButton>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <UButton color="red" variant="outline" block @click="reset">
              {{ $t("monthPicker.reset") }}
            </UButton>
            <UButton
              block
              @click="
                {
                  $emit(
                    'update:modelValue',
                    new Date(selectedYear, selectedMonth)
                  );
                  close();
                }
              "
            >
              {{ $t("monthPicker.save") }}
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
