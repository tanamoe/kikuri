import type { UsersResponse } from "~/types/pb";

export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.record) {
    return navigateTo("/login");
  }

  if (!($pb.authStore.record as UsersResponse).verified) {
    return navigateTo("/verification");
  }
});
