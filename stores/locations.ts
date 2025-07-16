export const useLocationsStore = defineStore("useLocationsStore", () => {
  const { data, status, execute } = useLazyFetch("/api/locations");

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value && data.value.length > 0) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin-filled",
        to: { name: "dashboard-location-slug", params: { slug: location.slug } },
        location,
      }));
      mapStore.mapPoints = data.value;
    }
    sidebarStore.loading = status.value === "pending";
  });

  return {
    locations: data,
    status,
    refresh: execute,
  };
});
