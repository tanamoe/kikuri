<script setup lang="ts">
import type { Dayjs } from "dayjs";
import { ModalSettingDisplay } from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";

const { t } = useI18n({ useScope: "global" });
const overlay = useOverlay();
const modal = overlay.create(ModalSettingDisplay);

const month = defineModel<Dayjs>("month", { required: true });
const publishers = defineModel<string[]>("publishers", {
  required: true,
});

defineProps<{
  pending: boolean;
}>();

const emit = defineEmits<{
  download: [];
}>();

const toolbar = ref<HTMLDivElement>();

const ui = {
  base: "rounded-none",
  indicator: "rounded-none",
};

const items = computed<DropdownMenuItem[]>(() => [
  [
    {
      label: t("general.print"),
      icon: "i-fluent-print-20-filled",
      disabled: true,
    },
    {
      label: t("general.download"),
      icon: "i-fluent-arrow-download-20-filled",
      disabled: true,
      onSelect() {
        emit("download");
      },
    },
  ],
  [
    {
      label: t("general.options"),
      icon: "i-fluent-options-20-filled",
      onSelect() {
        modal.open();
      },
    },
  ],
]);

onMounted(async () => {
  await nextTick();
  if (toolbar.value)
    document.documentElement.style.setProperty(
      "--toolbar-height",
      `${toolbar.value.clientHeight}px`,
    );
});
</script>

<template>
  <div
    id="toolbar"
    ref="toolbar"
    class="sticky top-0 z-30 mb-3 bg-(--ui-bg)/90 backdrop-blur"
  >
    <UContainer class="mx-auto px-6 py-3">
      <div
        class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-3 text-neutral-500">
            <img
              class="h-6 w-auto"
              src="/icon.svg"
              height="24"
              width="24"
              alt="Tana.moe logo"
            />
            <UIcon name="i-fluent-slash-forward-20-filled" class="text-2xl" />
          </div>

          <div class="flex gap-1">
            <div class="flex">
              <UButton
                icon="i-fluent-chevron-left-20-filled"
                color="neutral"
                variant="ghost"
                square
                @click="month = month.subtract(1, 'month')"
              />
              <UButton
                icon="i-fluent-chevron-right-20-filled"
                color="neutral"
                variant="ghost"
                square
                @click="month = month.add(1, 'month')"
              />
            </div>
          </div>

          <AppMonthPicker v-model="month" />
        </div>

        <div class="flex gap-3">
          <InputPublisher v-model="publishers" multiple count />

          <UDropdownMenu :items>
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-fluent-more-vertical-20-filled"
              square
            />
          </UDropdownMenu>
        </div>
      </div>
    </UContainer>
    <UProgress
      id="separator"
      class="transition-opacity"
      :model-value="!pending ? 100 : null"
      size="xs"
      :ui
    />
  </div>
</template>
