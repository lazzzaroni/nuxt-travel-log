<script lang="ts" setup>
import type { LocationInsertSchema } from "~/lib/db/schema";

import { LODZ } from "~/lib/constants";
import { locationInsertSchema } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: LocationInsertSchema;
  onSubmit: (location: LocationInsertSchema) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :schema="locationInsertSchema"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      long: (LODZ as [number, number])[0],
      lat: (LODZ as [number, number])[1],
    }"
    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
    :zoom="props.zoom || 6"
  >
    <AppFormField
      name="name"
      label="Name"
      :error="errors.name"
      :disabled="loading"
    />
    <AppFormField
      name="description"
      label="Description"
      type="textarea"
      :error="errors.description"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>

<style>

</style>
