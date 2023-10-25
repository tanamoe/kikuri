import type { UsersResponse } from "~/types/pb";

export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.isAuthRecord) {
    return navigateTo("/login");
  }

  if (!($pb.authStore.model as UsersResponse).verified) {
    return navigateTo("/verification");
  }
});
