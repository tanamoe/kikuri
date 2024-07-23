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
  dates: string[];
}>();

const position = ref();

const nearestDay = computed(() => {
  if (dayjs().isSame(props.dates[0], "month")) {
    return props.dates
      .map((date) => dayjs(date))
      .reduceRight((acc, val) => {
        if (val.isSameOrAfter(dayjs.tz().startOf("day")) && val.isBefore(acc))
          return val;
        return acc;
      })
      .format("YYYY-MM-DD");
  }

  return null;
});

function doScroll(position: string) {
  const el = document.getElementById(position) as HTMLDivElement;

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
}

function onScroll() {
  const els = document.getElementsByClassName("release-day");
  position.value = Array.from(els as HTMLCollectionOf<HTMLDivElement>)
    .filter((el) => el.getBoundingClientRect().bottom > 100)
    .sort(
      (el1, el2) =>
        el1.getBoundingClientRect().bottom - el2.getBoundingClientRect().bottom,
    )[0].id;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToNearest() {
  if (nearestDay.value)
    doScroll(props.dates[props.dates.indexOf(nearestDay.value)]);
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <div class="fixed bottom-3 left-1/2 z-20 w-max -translate-x-1/2">
    <div class="flex gap-3">
      <UButton
        color="gray"
        class="touch-none"
        icon="i-fluent-chevron-up-20-filled"
        :disabled="dates.indexOf(position) === -1"
        square
        :ui="floatingButton"
        @click="doScroll(dates[dates.indexOf(position) - 1])"
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
        class="touch-none"
        icon="i-fluent-chevron-down-20-filled"
        :disabled="dates.indexOf(position) === dates.length - 0"
        square
        :ui="floatingButton"
        @click="doScroll(dates[dates.indexOf(position) + 1])"
      />
    </div>
  </div>
</template>
