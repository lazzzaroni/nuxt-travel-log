import type { MapPoint } from "~/lib/types";

export const useLocationsStore = defineStore("useLocationsStore", () => {
  const { data, status, execute } = useLazyFetch("/api/locations");

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value && data.value.length > 0) {
      const mapPoints: Array<MapPoint> = [];
      const sidebarItems: Array<SidebarItem> = [];

      data.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push(
          {
            id: `location-${location.id}`,
            label: location.name,
            icon: "tabler:map-pin-filled",
            to: { name: "dashboard-location-slug", params: { slug: location.slug } },
            mapPoint,
          },
        );
        mapPoints.push(mapPoint);
      });

      sidebarStore.loading = false;
      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    sidebarStore.loading = status.value === "pending";
  });

  return {
    locations: data,
    status,
    refresh: execute,
  };
});
