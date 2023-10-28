type SelectedOptions = {
  id: string;
  label: string;
};

export const useAdvancedFilterStore = defineStore("advanced-filter", () => {
  const formats = ref<SelectedOptions[]>([]);
  const publishers = ref<SelectedOptions[]>([]);

  return { formats, publishers };
});
