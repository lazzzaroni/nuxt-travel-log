<script lang="ts" setup>
const locationStore = useLocationStore();
const mapStore = useMapStore();

const { locations, locationsStatus: status } = storeToRefs(locationStore);

onMounted(() => {
  locationStore.refreshLocations();
},
);
</script>

<template>
  <div class="p-4 min-h-64">
    <h2 class="text-2xl">
      Locations
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="locations && locations.length > 0" class=" flex flex-nowrap gap-4 mt-4 overflow-auto">
      <NuxtLink
        v-for="location in locations"
        :key="location.id"
        :to="{
          name: 'dashboard-location-slug',
          params: { slug: location.slug },
        }"
        class="card card-compact bg-base-300 h-40 w-72 shrink-0 hover:cursor-pointer border mb-2"
        :class="{
          'border-accent': isPointSelected(location, mapStore.selectedPoint),
          'border-transparent': !isPointSelected(location, mapStore.selectedPoint),
        }"
        @mouseenter="mapStore.selectedPoint = createMapPointFromLocation(location)"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h3 class="card-title">
            {{ location.name }}
          </h3>
          <p class="card-description">
            {{ location.description || "No description available" }}
          </p>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-fit">
        <Icon name="tabler:circle-plus-filled" size="24" />
        Add Location
      </NuxtLink>
    </div>
  </div>
</template>

<style>

</style>
