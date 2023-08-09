/* eslint-disable import/no-named-as-default-member */
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";

export default defineNuxtPlugin((_) => {
  dayjs.extend(localeData);
  dayjs.extend(utc);
  dayjs.extend(objectSupport);
  dayjs.locale("vi");
});
