<script lang="ts" setup>
const route = useRoute();

const mapStore = useMapStore();
const { slug } = route.params;
const { data: location, status, error } = await useLazyFetch(`/api/locations/${slug}`);

effect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value];
  }
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading loading-spinner loading-lg" />
    </div>
    <div v-if="location && status !== 'pending'">
      <h2 class="text-xl">
        {{ location.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
    </div>
    <div v-if="!location?.locationLogs.length" class="mt-4 flex flex-col gap-2">
      <p class="text-sm italic">
        Add a location log to get started
      </p>
      <button class="btn btn-primary w-fit">
        <Icon name="tabler:map-pin-plus" />
        Add Location Log
      </button>
    </div>
    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-xl">
        {{ error.statusMessage }}
      </h2>
    </div>
  </div>
</template>

<style>

</style>
