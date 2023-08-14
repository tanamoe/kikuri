export default defineI18nConfig(() => {
  return {
    legacy: false,
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
  };
});
