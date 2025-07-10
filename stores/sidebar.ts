export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  to: string;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<Array<SidebarItem>>([]);
  const loading = ref(false);

  return {
    sidebarItems,
    loading,
  };
});
