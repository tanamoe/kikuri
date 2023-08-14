/* eslint-disable import/no-named-as-default-member */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import objectSupport from "dayjs/plugin/objectSupport";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";

export default defineNuxtPlugin((_) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(objectSupport);
  dayjs.extend(localeData);
  dayjs.locale("vi");
  dayjs.tz.setDefault("Asia/Ho_Chi_Minh");
});
