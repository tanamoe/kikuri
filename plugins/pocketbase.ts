import PocketBase, { type AuthRecord } from "pocketbase";
import { Collections, type TypedPocketBase } from "@/types/pb";

export default defineNuxtPlugin(async () => {
  const { pocketbaseUrl } = useRuntimeConfig().public;
  const pb = new PocketBase(pocketbaseUrl) as TypedPocketBase;

  const cookie = useCookie<{
    token: string;
    record: AuthRecord;
  }>("pb_auth", {
    path: "/",
    secure: true,
    sameSite: "strict",
    httpOnly: false, // change to "true" if you want only server-side access
    maxAge: 604800,
  });

  // load the store data from the cookie value
  pb.authStore.save(cookie.value?.token, cookie.value?.record);

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      record: pb.authStore.record,
    };
  });

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (pb.authStore.isValid) {
      await pb.collection(Collections.Users).authRefresh();
    }
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return {
    provide: { pb },
  };
});
