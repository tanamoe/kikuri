import type { ReleasesStatusOptions } from "~/types/pb";

export function useReleaseStatus() {
  const { t } = useI18n({ useScope: "global" });

  const status = computed<
    {
      id: keyof typeof ReleasesStatusOptions;
      label: string;
      icon?: string;
    }[]
  >(() => [
    {
      id: "LICENSED",
      label: t("status.licensed"),
      icon: "i-fluent-book-information-20-filled",
    },
    {
      id: "ON_GOING",
      label: t("status.onGoing"),
      icon: "i-fluent-book-number-20-filled",
    },
    {
      id: "COMPLETED",
      label: t("status.completed"),
      icon: "i-fluent-book-letter-20-filled",
    },
    {
      id: "HIATUS",
      label: t("status.hiatus"),
      icon: "i-fluent-book-clock-20-filled",
    },
    {
      id: "CANCELLED",
      label: t("status.cancelled"),
      icon: "i-fluent-book-exclamation-mark-20-filled",
    },
  ]);

  return { status };
}
