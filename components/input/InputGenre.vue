<script setup lang="ts">
const { genres } = useMeta();

interface Props {
  multiple?: boolean;
  count?: boolean;
}

withDefaults(defineProps<Props>(), {
  multiple: false,
  count: false,
});

const model = defineModel<string | string[]>();

const items = computed(() =>
  genres.value.map(({ id, name }) => ({
    id,
    label: name,
  })),
);

const selected = computed(() =>
  genres.value.filter(
    ({ id }) => model.value === id || model.value?.includes(id),
  ),
);
</script>

<template>
  <USelectMenu
    v-model="model"
    :items
    :multiple
    searchable
    value-key="id"
    :searchable-placeholder="$t('general.searchPlaceholder')"
  >
    <span v-if="selected && selected.length > 0" class="truncate">
      <template v-if="count">
        {{ $t("general.genreCount", { count: selected.length }) }}
      </template>
      <template v-else>
        {{ selected.map(({ name }) => name).join(", ") }}
      </template>
    </span>
    <span v-else class="truncate">
      {{ $t("general.genreSelect") }}
    </span>
  </USelectMenu>
</template>
