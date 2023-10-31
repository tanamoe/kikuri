<script setup lang="ts">
const store = useBrowseStore();
const { status } = useReleaseStatus();

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
