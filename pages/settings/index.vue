<script setup lang="ts">
await navigateTo("/settings/profile");

definePageMeta({
  layout: "setting",
  middleware: "auth",
});
</script>
