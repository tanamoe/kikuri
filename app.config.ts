export default defineAppConfig({
  tana: {
    socials: [
      {
        name: "Facebook",
        url: "https://www.facebook.com/tanamoee",
        icon: "i-simple-icons-facebook",
      },
      {
        name: "X",
        url: "https://x.com/tanamoeeee",
        icon: "i-simple-icons-x",
      },
      {
        name: "Discord",
        url: "https://via.tana.moe/discord",
        icon: "i-simple-icons-discord",
      },
      {
        name: "GitHub",
        url: "https://github.com/tanamoe",
        icon: "i-simple-icons-github",
      },
    ],
    navigation: [
      {
        label: "general.releaseCalendar",
        to: "/calendar",
      },
      {
        label: "general.browse",
        to: "/browse",
        children: [
          {
            label: "general.title",
            to: "/browse/titles",
          },
          {
            label: "general.release",
            to: "/browse/releases",
          },
          {
            label: "general.publisher",
            to: "/browse/publishers",
          },
          {
            label: "general.staff",
            to: "/browse/staffs",
          },
        ],
      },
      {
        label: "general.library",
        badge: {
          label: "general.new",
          color: "primary",
          variant: "solid",
        },
        to: "/library",
      },
    ],
  },
  ui: {
    navigationMenu: {
      slots: {
        viewport: "z-50",
        indicator: "z-50",
        arrow: "z-50",
      },
    },
    colors: {
      primary: "tanablue",
      secondary: "tanaamber",
      neutral: "zinc",
    },
    icons: {
      arrowLeft: "fluent:arrow-left-20-filled",
      arrowRight: "fluent:arrow-right-20-filled",
      check: "fluent:checkmark-20-filled",
      chevronDoubleLeft: "fluent:chevron-double-left-20-filled",
      chevronDoubleRight: "fluent:chevron-double-right-20-filled",
      chevronDown: "fluent:chevron-down-20-filled",
      chevronLeft: "fluent:chevron-left-20-filled",
      chevronRight: "fluent:chevron-right-20-filled",
      chevronUp: "fluent:chevron-up-20-filled",
      close: "fluent:dismiss-20-filled",
      ellipsis: "fluent:more-horizontal-20-filled",
      external: "fluent:arrow-exit-20-filled",
      folder: "fluent:folder-20-filled",
      folderOpen: "i-lucide-folder-open",
      loading: "fluent:folder-open-20-filled",
      minus: "fluent:subtract-20-filled",
      plus: "fluent:add-20-filled",
      search: "fluent:search-20-filled",
    },

    container: {
      base: "mx-auto",
      padding: "px-6 sm:px-6 lg:px-6",
      constrained: "container max-w-[auto]",
    },
    card: {
      header: {
        padding: "p-4 sm:p-4",
      },
      body: {
        padding: "p-4 sm:p-4",
      },
    },
    button: {
      variant: {
        soft: "text-{color}-500 dark:text-{color}-400 bg-{color}-100 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-800 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
      },
      color: {
        gray: {
          ghost: "hover:bg-neutral-200",
        },
      },
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-20-filled",
      },
    },
    formGroup: {
      description: "text-neutral-500 dark:text-neutral-400 text-sm",
      hint: "text-neutral-500 dark:text-neutral-400 text-sm",
      help: "mt-2 text-neutral-500 dark:text-neutral-400 text-sm",
      error: "mt-2 text-red-500 dark:text-red-400 text-sm",
    },
    table: {
      default: {
        sortAscIcon: "i-fluent-arrow-sort-down-20-filled",
        sortDescIcon: "i-fluent-arrow-sort-up-20-filled",
        sortButton: {
          icon: "i-fluent-arrow-sort-20-filled",
        },
        loadingState: {
          icon: "i-fluent-arrow-clockwise-20-filled",
        },
        emptyState: {
          icon: "i-fluent-database-20-filled",
        },
      },
    },
    input: {
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-20-filled",
      },
    },
    select: {
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-20-filled",
        trailingIcon: "i-fluent-chevron-down-20-filled",
      },
    },
    selectMenu: {
      default: {
        selectedIcon: "i-fluent-checkmark-20-filled",
      },
    },
    notification: {
      default: {
        closeButton: {
          icon: "i-fluent-dismiss-20-filled",
        },
      },
    },
    commandPalette: {
      default: {
        icon: "i-fluent-search-20-filled",
        loadingIcon: "i-fluent-arrow-clockwise-20-filled",
        selectedIcon: "i-fluent-checkmark-20-filled",
        emptyState: {
          icon: "i-fluent-search-20-filled",
        },
      },
    },
    pagination: {
      default: {
        prevButton: {
          icon: "i-fluent-chevron-left-20-filled",
        },
        nextButton: {
          icon: "i-fluent-chevron-right-20-filled",
        },
      },
    },
    breadcrumb: {
      li: "min-w-0",
      base: "block whitespace-nowrap truncate",
    },
  },
});
