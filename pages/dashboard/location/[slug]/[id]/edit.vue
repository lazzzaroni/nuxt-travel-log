<script lang="ts" setup>
import type { LocationLogInsertSchema } from "~/lib/db/schema";

const route = useRoute();

const locationStore = useLocationStore();
const { currentLocationLog: locationLog } = storeToRefs(locationStore);

const { $csrfFetch } = useNuxtApp();

async function handleSubmit(values: LocationLogInsertSchema) {
  await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
    method: "put",
    body: values,
  });
}

function handleSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug-id",
    params: { slug: route.params.slug, id: route.params.id },
  });
}
</script>

<template>
  <LocationLogForm
    v-if="locationLog "
    :on-submit="handleSubmit"
    :on-submit-complete="handleSubmitComplete"
    submit-label="Update Location Log"
    submit-icon="tabler:edit"
    :initial-values="locationLog"
  />
</template>

<style>

</style>
