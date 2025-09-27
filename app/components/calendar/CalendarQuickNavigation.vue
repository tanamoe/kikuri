<script setup lang="ts">
import dayjs from "dayjs";

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
    )[0]?.id;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToNearest() {
  if (nearestDay.value) {
    const pos = props.dates[props.dates.indexOf(nearestDay.value)];
    if (pos) doScroll(pos);
  }
}

function scrollToPrev() {
  const pos = props.dates[props.dates.indexOf(position.value) - 1];
  if (pos) doScroll(pos);
}

function scrollToNext() {
  const pos = props.dates[props.dates.indexOf(position.value) + 1];
  if (pos) doScroll(pos);
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
        color="neutral"
        variant="subtle"
        class="touch-none"
        icon="i-fluent-chevron-up-20-filled"
        :disabled="dates.indexOf(position) === -1"
        square
        @click="scrollToPrev"
      />
      <UButton
        icon="i-fluent-arrow-up-20-filled"
        color="neutral"
        variant="subtle"
        @click="scrollToTop"
      >
        {{ $t("general.top") }}
      </UButton>
      <UButton
        v-if="nearestDay"
        icon="i-fluent-arrow-turn-up-down-20-filled"
        color="neutral"
        variant="subtle"
        :trailing="true"
        @click="scrollToNearest"
      >
        {{ $t("general.toNearest") }}
      </UButton>
      <UButton
        color="neutral"
        variant="subtle"
        class="touch-none"
        icon="i-fluent-chevron-down-20-filled"
        :disabled="dates.indexOf(position) === dates.length - 0"
        square
        @click="scrollToNext"
      />
    </div>
  </div>
</template>
