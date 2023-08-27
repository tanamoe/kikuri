<script setup lang="ts">
definePageMeta({
  layout: "setting",
  middleware: [
    () => {
      const { $pb } = useNuxtApp();

      if ($pb.authStore.isAuthRecord) {
        return navigateTo("/settings/profile");
      } else {
        return navigateTo("/settings/interface");
      }
    },
  ],
});
</script>
