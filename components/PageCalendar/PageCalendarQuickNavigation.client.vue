<script setup lang="ts">
import dayjs from "dayjs";

const floatingButton = {
  color: {
    gray: {
      solid:
        "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
    },
  },
};

const props = defineProps<{
  currentDay: string;
  dates: string[];
  scroll: (position: string) => void;
}>();

const nearestDay = computed(() => {
  if (dayjs().isSame(props.dates[0], "month")) {
    return props.dates
      .map((date) => dayjs(date))
      .reduceRight((acc, val) => {
        if (val.isSameOrAfter(dayjs.tz().startOf("day")) && val.isBefore(acc))
          return val;
        else return acc;
      })
      .format("YYYY-MM-DD");
  }
});

function scrollUp() {
  props.scroll(props.dates[props.dates.indexOf(props.currentDay) - 1]);
}

function scrollDown() {
  props.scroll(props.dates[props.dates.indexOf(props.currentDay) + 1]);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToNearest() {
  if (nearestDay.value)
    props.scroll(props.dates[props.dates.indexOf(nearestDay.value)]);
}
</script>

<template>
  <div class="fixed bottom-3 left-1/2 z-20 w-max -translate-x-1/2">
    <div class="flex gap-3">
      <UButton
        color="gray"
        icon="i-fluent-chevron-up-20-filled"
        :disabled="dates.indexOf(currentDay) === -1"
        square
        :ui="floatingButton"
        @click="scrollUp"
      />
      <UButton
        icon="i-fluent-arrow-up-20-filled"
        color="gray"
        :ui="floatingButton"
        @click="scrollToTop"
      >
        {{ $t("general.top") }}
      </UButton>
      <UButton
        v-if="nearestDay"
        icon="i-fluent-arrow-turn-up-down-20-filled"
        color="gray"
        :trailing="true"
        :ui="floatingButton"
        @click="scrollToNearest"
      >
        {{ $t("general.toNearest") }}
      </UButton>
      <UButton
        color="gray"
        icon="i-fluent-chevron-down-20-filled"
        :disabled="dates.indexOf(currentDay) === dates.length - 0"
        square
        :ui="floatingButton"
        @click="scrollDown"
      />
    </div>
  </div>
</template>
