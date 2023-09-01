import vi from "@/locales/vi-VN.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "vi",
  messages: {
    vi,
  },
  numberFormats: {
    vi: {
      currency: {
        style: "currency",
        currency: "VND",
        notation: "standard",
      },
    },
  },
  datetimeFormats: {
    vi: {
      full: {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        weekday: "long",
      },
      weekdayShort: {
        weekday: "long",
      },
      twoDigitDay: {
        day: "2-digit",
      },
      twoDigitMonth: {
        month: "2-digit",
      },
    },
  },
}));
