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
  },
  ui: {
    primary: "tanablue",
    gray: "zinc",
    container: {
      base: "mx-auto",
      padding: "px-6 sm:px-6 lg:px-6",
      constrained: "container max-w-[auto]",
    },
    button: {
      variant: {
        soft: "text-{color}-500 dark:text-{color}-400 bg-{color}-100 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-800 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
      },
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-24-filled",
      },
    },
    formGroup: {
      description: "text-gray-500 dark:text-gray-400 text-sm",
      hint: "text-gray-500 dark:text-gray-400 text-sm",
      help: "mt-2 text-gray-500 dark:text-gray-400 text-sm",
      error: "mt-2 text-red-500 dark:text-red-400 text-sm",
    },
    table: {
      td: {
        base: "whitespace-normal",
      },
      default: {
        sortAscIcon: "i-fluent-arrow-sort-down-24-filled",
        sortDescIcon: "i-fluent-arrow-sort-up-24-filled",
        sortButton: {
          icon: "i-fluent-arrow-sort-24-filled",
        },
        loadingState: {
          icon: "i-fluent-arrow-clockwise-24-filled",
        },
        emptyState: {
          icon: "i-fluent-database-24-filled",
        },
      },
    },
    input: {
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-24-filled",
      },
    },
    select: {
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-24-filled",
        trailingIcon: "i-fluent-chevron-down-24-filled",
      },
    },
    selectMenu: {
      default: {
        selectedIcon: "i-fluent-checkmark-24-filled",
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
        icon: "i-fluent-search-24-filled",
        loadingIcon: "i-fluent-arrow-clockwise-24-filled",
        selectedIcon: "i-fluent-checkmark-24-filled",
        emptyState: {
          icon: "i-fluent-search-24-filled",
        },
      },
    },
    pagination: {
      default: {
        prevButton: {
          icon: "i-octicon-arrow-left-24",
        },
        nextButton: {
          icon: "i-octicon-arrow-right-24",
        },
      },
    },
  },
});
