<script lang="ts" setup>
import type { LocationLogInsertSchema } from "~/lib/db/schema";

import { LODZ } from "~/lib/constants";

const route = useRoute();

const { currentLocation } = useLocationStore();

const { $csrfFetch } = useNuxtApp();

async function handleSubmit(values: LocationLogInsertSchema) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: "post",
    body: values,
  });
}

function handleSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <LocationLogForm
    :on-submit="handleSubmit"
    :on-submit-complete="handleSubmitComplete"
    submit-label="Add Location Log"
    submit-icon="tabler:plus"
    :initial-values="{
      name: '',
      description: '',
      startedAt: Date.now() - (1000 * 60 * 60 * 24),
      endedAt: Date.now(),
      long: currentLocation?.long || (LODZ as [number, number])[0],
      lat: currentLocation?.lat || (LODZ as [number, number])[1],
    }"
  />
</template>

<style>

</style>
