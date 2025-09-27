<script setup lang="tsx">
import { ModalCollectionRemove } from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const route = useRoute();
const settingsStore = useSettingsStore();
const overlay = useOverlay();
const modal = overlay.create(ModalCollectionRemove);

const props = defineProps<{
  id: string;
  name: string;
  editable: boolean;
}>();

const items = computed<DropdownMenuItem[]>(() => [
  [
    {
      label: t("general.missingBooks"),
      icon: "i-fluent-book-question-mark-20-filled",
      to: "/missing-entries",
    },
  ],
  [
    {
      label: t("library.editCollection"),
      icon: "i-fluent-edit-20-filled",
      to: `/library/edit?id=${route.params.collectionId}`,
    },
    {
      label: t("library.setDefaultCollection"),
      icon: "i-fluent-library-20-filled",
      disabled:
        settingsStore.library.defaultLibraryId === route.params.collectionId,
      onSelect() {
        settingsStore.library.defaultLibraryId = route.params
          .collectionId as string;
      },
    },
  ],
  [
    {
      label: t("general.settings"),
      icon: "i-fluent-settings-20-filled",
      to: "/settings/library",
    },
  ],
  [
    {
      label: t("library.removeCollection"),
      icon: "i-fluent-delete-20-filled",
      onSelect() {
        modal.open({
          collection: {
            id: props.id,
            name: props.name,
          },
        });
      },
    },
  ],
]);
</script>

<template>
  <UDropdownMenu v-if="editable" :items>
    <UButton
      color="neutral"
      variant="subtle"
      trailing-icon="i-fluent-more-vertical-20-filled"
    />
  </UDropdownMenu>
</template>
