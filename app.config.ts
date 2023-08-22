export default defineAppConfig({
  ui: {
    primary: "tanablue",
    gray: "zinc",
    container: {
      base: "mx-auto",
      padding: "px-6",
      constrained: "container",
    },
    badge: {
      variant: {
        overlay: "bg-{color}-400 bg-opacity-50 backdrop-blur text-gray-900",
      },
    },
    button: {
      variant: {
        soft: "text-{color}-500 dark:text-{color}-400 bg-{color}-100 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-800 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
      },
    },
    formGroup: {
      description: "text-gray-500 dark:text-gray-400 text-sm",
      hint: "text-gray-500 dark:text-gray-400 text-sm",
      help: "mt-2 text-gray-500 dark:text-gray-400 text-sm",
      error: "mt-2 text-red-500 dark:text-red-400 text-sm",
    },
  },
});
