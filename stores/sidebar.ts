import type { MapPoint } from "~/lib/types";

export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  to: string;
  location?: MapPoint | null;

};

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<Array<SidebarItem>>([]);
  const loading = ref(false);

  return {
    sidebarItems,
    loading,
  };
});
