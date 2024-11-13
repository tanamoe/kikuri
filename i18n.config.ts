import vi from "@/i18n/locales/vi-VN.json";

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
      gram: {
        style: "unit",
        unit: "gram",
        notation: "standard",
      },
      centimeter: {
        style: "unit",
        unit: "centimeter",
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
      publishDate: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
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
