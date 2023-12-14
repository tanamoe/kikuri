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
          ghost: "hover:bg-gray-200",
        },
      },
      default: {
        loadingIcon: "i-fluent-arrow-clockwise-20-filled",
      },
    },
    formGroup: {
      description: "text-gray-500 dark:text-gray-400 text-sm",
      hint: "text-gray-500 dark:text-gray-400 text-sm",
      help: "mt-2 text-gray-500 dark:text-gray-400 text-sm",
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
  },
  // TODO: remove on upstream fix
  // https://github.com/nuxt/ui/issues/1043
  nuxtIcon: {},
});
