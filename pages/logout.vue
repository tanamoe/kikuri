<script setup>
const { $pb } = useNuxtApp();

$pb.authStore.clear();

navigateTo("/");
</script>
