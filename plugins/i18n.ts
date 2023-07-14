import dayjs from "dayjs";

export default defineNuxtPlugin((nuxtApp) => {
  // called right after a new locale has been set
  nuxtApp.hook("i18n:localeSwitched", ({ newLocale }) => {
    // eslint-disable-next-line import/no-named-as-default-member
    dayjs.locale(newLocale);
  });
});
