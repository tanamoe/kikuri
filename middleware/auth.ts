export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.isAuthRecord) {
    return navigateTo("/login");
  }
});
