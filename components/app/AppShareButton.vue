<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();

const { share, isSupported: shareSupported } = useShare();
const { copy, copied, isSupported: clipboardSupported } = useClipboard();
const { t } = useI18n({ useScope: "global" });
const toast = useToast();

function startShare() {
  share({ title: props.title, url: location.href });
}

function copyLink() {
  toast.add({
    color: "primary",
    title: t("general.copySuccess"),
    icon: "i-fluent-checkmark-circle-20-filled",
  });
  copy(location.href);
}
</script>

<template>
  <UButton
    v-if="shareSupported"
    icon="i-fluent-share-ios-20-regular"
    color="gray"
    square
    @click="startShare"
  />
  <UButton
    v-else-if="clipboardSupported"
    :icon="
      copied ? 'i-fluent-checkmark-20-filled' : 'i-fluent-share-ios-20-filled'
    "
    color="gray"
    square
    @click="copyLink"
  />
</template>
