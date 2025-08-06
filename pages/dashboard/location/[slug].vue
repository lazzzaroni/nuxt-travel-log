<script lang="ts" setup>
import type { FetchError } from "ofetch";

import formatDate from "~/utils/format-date";
import { createMapPointFromLocationLog } from "~/utils/map-points";

const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationError: error,
  currentLocationStatus: status,
} = storeToRefs(locationStore);

const isOpened = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

function openDialog() {
  isOpened.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDeleteLocation() {
  try {
    isOpened.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}`, {
      method: "DELETE",
    });

    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

onMounted(() => {
  locationStore.refreshCurrentLocation();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
      <h2 class="text-xl">
        {{ location.name }}
        <div class="dropdown dropdown-bottom">
          <div tabindex="0" role="button" class="btn m-1 p-0 btn-sm">
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink :to="{ name: 'dashboard-location-slug-edit', params: { slug: route.params.slug } }">
                <Icon name="tabler:edit" size="20" />
                Edit
              </NuxtLink>
            </li>
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash" size="20" />
                Delete
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started.
        </p>
        <NuxtLink
          :to="{
            name: 'dashboard-location-slug-add',
            params: { slug: route.params.slug },
          }"
          class="btn btn-primary mt-2"
        >
          <Icon name="tabler:map-pin-plus" size="24" />
          Add Location Log
        </NuxtLink>
      </div>
      <div v-if="route.name === 'dashboard-location-slug' && !loading && location.locationLogs.length > 0" class="location-list">
        <LocationCard v-for="locationLog in location.locationLogs" :key="locationLog.id" :map-point="createMapPointFromLocationLog(locationLog)">
          <template #top>
            <div class="flex items-center gap-2">
              <Icon name="tabler:calendar" size="20" />
              <span class="text-sm text-gray-500 italic">
                <span v-if="locationLog.startedAt !== locationLog.endedAt">
                  {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
                </span>
                <span v-else>{{ formatDate(locationLog.startedAt) }}</span>
              </span>
            </div>
          </template>
        </LocationCard>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      :is-opened="isOpened"
      title="Are you sure?"
      description="Deleting this location will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete this location"
      confirm-class="btn-error"
      @on-closed="isOpened = false"
      @on-confirmed="confirmDeleteLocation"
    />
  </div>
</template>
