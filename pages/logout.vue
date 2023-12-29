<script setup lang="ts">
const { $pb } = useNuxtApp();

onMounted(async () => {
  $pb.authStore.clear();

  await navigateTo("/");
});
</script>
