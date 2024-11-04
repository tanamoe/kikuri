<script setup lang="ts">
const { $pb } = useNuxtApp();
const { publishers } = useMeta();

interface Props {
  multiple?: boolean;
  count?: boolean;
}

withDefaults(defineProps<Props>(), {
  multiple: false,
  count: false,
});

const model = defineModel<string | string[]>();

const options = computed(() =>
  publishers.value.map((publisher) => ({
    id: publisher.id,
    label: publisher.name,
    color: publisher.color,
    avatar: publisher.logo && {
      src: $pb.files.getUrl(publisher, publisher.logo),
    },
  })),
);

const selected = computed(() =>
  publishers.value.filter(
    ({ id }) => model.value === id || model.value?.includes(id),
  ),
);
</script>

<template>
  <USelectMenu
    v-model="model"
    :options
    :multiple
    searchable
    value-attribute="id"
    :searchable-placeholder="$t('general.searchPlaceholder')"
  >
    <template #label>
      <span v-if="selected && selected.length > 0" class="truncate">
        <template v-if="count">
          <span class="inline-flex items-center -space-x-1">
            <template v-for="publisher of selected" :key="publisher.id">
              <span
                v-if="publisher.color"
                class="mt-px h-2 w-2 flex-shrink-0 rounded-full"
                :style="{ background: publisher.color }"
              />
            </template>
          </span>
          {{ $t("general.publisherCount", { count: selected.length }) }}
        </template>
        <template v-else>
          {{ selected.map(({ name }) => name).join(", ") }}
        </template>
      </span>
      <span v-else class="truncate">{{ $t("general.publisherSelect") }}</span>
    </template>
  </USelectMenu>
</template>
