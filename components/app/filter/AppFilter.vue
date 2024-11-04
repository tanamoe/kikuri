<script setup lang="ts">
const status = defineModel<string>("status");
const genres = defineModel<string[]>("genres");
const demographics = defineModel<string[]>("demographics");
const publishers = defineModel<string[]>("publishers");
const partners = defineModel<string[]>("partners");
const formats = defineModel<string[]>("formats");

const count = computed(() =>
  useSum([
    publishers.value?.length ?? 0,
    formats.value?.length ?? 0,
    genres.value?.length ?? 0,
  ]),
);

defineEmits<{
  reset: [];
  apply: [];
}>();
</script>

<template>
  <UPopover
    :ui="{ base: 'overflow-visible', width: 'w-full max-w-xs md:max-w-md' }"
    :popper="{
      placement: 'bottom-start',
    }"
  >
    <UButton icon="i-fluent-filter-20-filled" color="gray">
      {{ $t("general.advancedFilter") }}
      <span v-if="count.value > 0">({{ count }})</span>
    </UButton>
    <template #panel>
      <UCard
        class="overflow-visible"
        :ui="{ body: { base: 'space-y-6', padding: 'p-6 sm:p-6' } }"
      >
        <div class="grid grid-cols-2 gap-6">
          <div v-if="formats">
            {{ $t("general.format") }}
            <div class="flex items-center gap-1">
              <InputFormat v-model="formats" multiple count class="flex-1" />
              <UButton
                v-if="formats.length > 0"
                icon="i-fluent-delete-20-filled"
                square
                variant="ghost"
                color="red"
                @click="formats = []"
              />
            </div>
          </div>
          <div v-if="demographics">
            {{ $t("general.demographic") }}
            <div class="flex items-center gap-1">
              <InputDemographic
                v-model="demographics"
                multiple
                count
                class="flex-1"
              />
              <UButton
                v-if="demographics.length > 0"
                icon="i-fluent-delete-20-filled"
                square
                variant="ghost"
                color="red"
                @click="demographics = []"
              />
            </div>
          </div>

          <div v-if="status !== undefined" class="col-span-2">
            {{ $t("general.status") }}
            <div class="flex items-center gap-1">
              <InputReleaseStatus v-model="status" count class="flex-1" />
              <UButton
                v-if="status"
                icon="i-fluent-delete-20-filled"
                square
                variant="ghost"
                color="red"
                @click="status = ''"
              />
            </div>
          </div>

          <div v-if="publishers" class="col-span-2">
            {{ $t("general.publisher") }}
            <div class="flex items-center gap-1">
              <InputPublisher
                v-model="publishers"
                multiple
                count
                class="flex-1"
              />
              <UButton
                v-if="publishers.length > 0"
                icon="i-fluent-delete-20-filled"
                square
                variant="ghost"
                color="red"
                @click="publishers = []"
              />
            </div>
          </div>

          <div v-if="partners" class="col-span-2">
            {{ $t("general.partner") }}
            <div class="flex items-center gap-1">
              <InputPublisher
                v-model="partners"
                multiple
                count
                class="flex-1"
              />
              <UButton
                v-if="partners.length > 0"
                icon="i-fluent-delete-20-filled"
                square
                variant="ghost"
                color="red"
                @click="partners = []"
              />
            </div>
          </div>

          <div v-if="genres" class="col-span-2">
            {{ $t("general.genre") }}
            <div class="flex items-center gap-1">
              <InputGenre v-model="genres" multiple count class="flex-1" />
              <UButton
                v-if="genres.length > 0"
                icon="i-fluent-delete-20-filled"
                square
                variant="ghost"
                color="red"
                @click="genres = []"
              />
            </div>
          </div>
        </div>

        <div class="space-x-3 text-right">
          <UButton variant="ghost" color="red" @click="$emit('reset')">
            {{ $t("general.reset") }}
          </UButton>
          <UButton @click="$emit('apply')">{{ $t("general.apply") }}</UButton>
        </div>
      </UCard>
    </template>
  </UPopover>
</template>
