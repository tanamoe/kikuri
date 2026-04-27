<script setup lang="ts">
definePageMeta({
  layout: "setting",
  middleware: [
    () => {
      const { $pb } = useNuxtApp();

      if ($pb.authStore.record?.collectionName) {
        return navigateTo("/settings/profile");
      } else {
        return navigateTo("/settings/interface");
      }
    },
  ],
});
</script>
