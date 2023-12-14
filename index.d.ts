declare module "#app" {
  interface PageMeta {
    stickyNav?: boolean;
    childOverflow?: boolean;
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
