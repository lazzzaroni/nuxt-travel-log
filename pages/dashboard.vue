<script lang="ts" setup>
const sidebarStore = useSidebarStore();
const locationStore = useLocationStore();
const mapStore = useMapStore();

const route = useRoute();

const isSidebarOpen = ref(true);

const { currentLocation } = storeToRefs(locationStore);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen.value));
}

effect(() => {
  if (route.name === "dashboard") {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Locations",
      to: "/dashboard",
      icon: "tabler:map",
    }, {
      id: "link-location-add",
      label: "Add Location",
      to: "/dashboard/add",
      icon: "tabler:circle-plus-filled",
    }];
  }
  else if (route.name === "dashboard-location-slug") {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Back to Locations",
      to: "/dashboard",
      icon: "tabler:arrow-left",
    }, {
      id: "link-dashboard",
      label: currentLocation.value ? currentLocation.value.name : "View Logs",
      to: {
        name: "dashboard-location-slug",
        params: {
          slug: currentLocation.value?.slug,
        },
      },
      icon: "tabler:map",
    }, {
      id: "link-location-edit",
      label: "Edit Location",
      to: {
        name: "dashboard-location-slug-edit",
        params: {
          slug: currentLocation.value?.slug,
        },
      },
      icon: "tabler:map-pin-cog",
    }, {
      id: "link-location-add",
      label: "Add Location Log",
      to: {
        name: "dashboard-location-slug-add",
        params: {
          slug: currentLocation.value?.slug,
        },
      },
      icon: "tabler:circle-plus-filled",
    }];
  }
});

onMounted(() => {
  const storedState = localStorage.getItem("isSidebarOpen");
  if (storedState !== null) {
    isSidebarOpen.value = JSON.parse(storedState);
  }

  if (route.path !== "/dashboard") {
    locationStore.refreshLocations();
  }
});
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex">
        <button class="btn btn-ghost w-full p-2 h-12" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
          <Icon
            v-if="isSidebarOpen"
            name="tabler:chevron-left"
            size="32"
            class="self-end"
          />
          <Icon
            v-else
            name="tabler:chevron-right"
            size="32"
            class="self-end"
          />
        </button>
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :icon="item.icon"
          :label="item.label"
          :to="item.to"
        />

        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length > 0" class="divider" />

        <div v-if="sidebarStore.loading" class="px-2">
          <div class="skeleton h-10 w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length > 0" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :icon="item.icon"
            :label="item.label"
            :to="item.to"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.mapPoint || null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>

        <div class="divider" />

        <SidebarButton
          :show-label="isSidebarOpen"
          icon="tabler:logout-2"
          label="Sign Out"
          to="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div class="flex size-full" :class="{ 'flex-col': route.path !== '/dashboard/add' }">
        <NuxtPage />
        <AppMap />
      </div>
    </div>
  </div>
</template>

<style>

</style>
