import { Record } from "pocketbase";

export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if (!($pb.authStore.model instanceof Record)) {
    return navigateTo("/login");
  }
});
