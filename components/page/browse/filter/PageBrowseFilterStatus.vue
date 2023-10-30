<script setup lang="ts">
import type { ReleasesStatusOptions } from "~/types/pb";

const { t } = useI18n({ useScope: "global" });
const store = useBrowseStore();

const status = computed<
  {
    id: keyof typeof ReleasesStatusOptions;
    label: string;
    icon?: string;
  }[]
>(() => [
  {
    id: "LICENSED",
    label: t("status.licensed"),
    icon: "i-fluent-book-information-20-filled",
  },
  {
    id: "ON_GOING",
    label: t("status.onGoing"),
    icon: "i-fluent-book-number-20-filled",
  },
  {
    id: "COMPLETED",
    label: t("status.completed"),
    icon: "i-fluent-book-letter-20-filled",
  },
  {
    id: "HIATUS",
    label: t("status.hiatus"),
    icon: "i-fluent-book-clock-20-filled",
  },
  {
    id: "CANCELLED",
    label: t("status.cancelled"),
    icon: "i-fluent-book-exclamation-mark-20-filled",
  },
]);

const selected = computed(() => {
  return status.value.filter((s) => store.status.includes(s.id));
});
</script>

<template>
  <USelectMenu
    v-model="store.status"
    :options="status"
    multiple
    value-attribute="id"
  >
    <template #label>
      <template v-if="selected.length > 0">
        <UAvatarGroup size="2xs" :max="2">
          <template v-for="s of selected" :key="s.id">
            <UAvatar v-if="s.icon" :icon="s.icon" size="2xs" />
          </template>
        </UAvatarGroup>
        <span class="truncate">
          {{ selected.map((s) => s.label).join(", ") }}
        </span>
      </template>
      <span v-else class="truncate">{{ $t("general.statusSelect") }}</span>
    </template>
  </USelectMenu>
</template>
