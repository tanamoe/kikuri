import { locale } from "dayjs";

export default defineNuxtPlugin((nuxtApp) => {
  // called right after a new locale has been set
  nuxtApp.hook("i18n:localeSwitched", ({ newLocale }) => {
    locale(newLocale);
  });
});
