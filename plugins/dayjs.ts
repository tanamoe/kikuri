/* eslint-disable import/no-named-as-default-member */
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";

export default defineNuxtPlugin((_) => {
  dayjs.extend(localeData);
  dayjs.extend(utc);
  dayjs.locale("vi");
});
