import type {
  ReleasesStatusOptions,
  CollectionBooksStatusOptions,
  CollectionsVisibilityOptions,
} from "@/types/pb";

type Options<T> = {
  id: T;
  label: string;
  icon?: string;
};

export function useOptions() {
  const { t } = useI18n({ useScope: "global" });

  const releaseStatus = computed<Options<keyof typeof ReleasesStatusOptions>[]>(
    () => [
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
    ],
  );

  const collectionBookStatus = computed<
    Options<keyof typeof CollectionBooksStatusOptions>[]
  >(() => [
    {
      id: "PLANNING",
      label: t("status.planning"),
      icon: "i-fluent-book-information-20-filled",
    },
    {
      id: "COMPLETED",
      label: t("status.completed"),
      icon: "i-fluent-book-letter-20-filled",
    },
  ]);

  const collectionVisibility = computed<
    Options<keyof typeof CollectionsVisibilityOptions>[]
  >(() => [
    {
      id: "PRIVATE",
      label: t("visibility.private"),
      icon: "i-fluent-lock-20-filled",
    },
    {
      id: "UNLISTED",
      label: t("visibility.unlisted"),
      icon: "i-fluent-link-20-filled",
    },
    {
      id: "PUBLIC",
      label: t("visibility.public"),
      icon: "i-fluent-globe-20-filled",
    },
  ]);

  return { releaseStatus, collectionBookStatus, collectionVisibility };
}
