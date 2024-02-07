<script setup lang="ts">
const { $pb } = useNuxtApp();

onMounted(() => {
  $pb.authStore.clear();

  return navigateTo("/");
});
</script>
