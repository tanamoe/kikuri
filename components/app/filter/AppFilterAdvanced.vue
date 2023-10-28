<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();

defineEmits<{
  change: [void];
}>();

const { data: formats } = await useAsyncData(
  () => $pb.collection(Collections.Formats).getFullList(),
  {
    transform: (formats) =>
      formats.map(({ id, name }) => ({
        id,
        label: name,
      })),
  },
);

const { data: publishers } = await useAsyncData(
  () => $pb.collection(Collections.Publishers).getFullList(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        id: publisher.id,
        label: publisher.name,
        avatar:
          publisher.logo !== ""
            ? {
                src: $pb.files.getUrl(publisher, publisher.logo),
              }
            : undefined,
      })),
  },
);
</script>

<template>
  <UPopover
    :ui="{ base: 'overflow-visible', width: 'w-full max-w-md' }"
    :popper="{
      placement: 'bottom-start',
    }"
  >
    <UButton icon="i-fluent-filter-20-filled" color="gray">
      {{ $t("general.advancedFilter") }}
    </UButton>
    <template #panel>
      <UCard
        class="overflow-visible"
        :ui="{ body: { base: 'space-y-6', padding: 'p-6 sm:p-6' } }"
      >
        <div class="flex gap-6">
          <div class="flex-1">
            {{ $t("general.format") }}
            <AppFilterFormat :formats="formats || []" />
          </div>
          <div class="flex-1">
            {{ $t("general.publisher") }}
            <AppFilterPublisher :publishers="publishers || []" />
          </div>
        </div>
        <div class="text-right">
          <UButton @click="$emit('change')">{{ $t("general.apply") }}</UButton>
        </div>
      </UCard>
    </template>
  </UPopover>
</template>
