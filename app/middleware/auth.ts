export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.record) {
    return navigateTo("/login");
  }
});
