<script lang="ts" setup>
import type { LocationLogInsertSchema } from "~/lib/db/schema";

import { LODZ } from "~/lib/constants";
import { locationLogInsertSchema } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: LocationLogInsertSchema;
  onSubmit: (location: LocationLogInsertSchema) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - (1000 * 60 * 60 * 24),
  endedAt: Date.now(),
  long: (LODZ as [number, number])[0],
  lat: (LODZ as [number, number])[1],
};
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :schema="locationLogInsertSchema"
    :initial-values="props.initialValues || initialValues"
    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
    :zoom="11"
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
    <AppDateFormField
      name="startedAt"
      label="Started At"
      :value="initialValues.startedAt"
      :error="errors.startedAt"
      :disabled="loading"
    />
    <AppDateFormField
      name="endedAt"
      label="Ended At"
      :value="initialValues.endedAt"
      :error="errors.endedAt"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>

<style>

</style>
