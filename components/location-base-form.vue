<script lang="ts" setup generic="T extends LatLongItem">
import type { FetchError } from "ofetch";
import type { ZodSchema } from "zod";

import { toTypedSchema } from "@vee-validate/zod";

import type { LatLongItem, NominatimResult } from "~/lib/types";

import { LODZ } from "~/lib/constants";

const props = defineProps<{
  initialValues: T;
  schema: ZodSchema;
  onSubmit: (location: T) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom: number;
}>();

const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues,
});

const onSubmit = handleSubmit(async (values: T) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function formatCoordinates(formData: typeof controlledValues.value): string {
  if (!formData.lat || !formData.long) {
    return "0.000000, 0.000000";
  }
  return `${formData.lat.toFixed(5)}, ${formData.long.toFixed(5)}`;
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
    zoom: props.zoom,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: props.initialValues?.long || (LODZ as [number, number])[0],
    lat: props.initialValues?.lat || (LODZ as [number, number])[1],
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
  >
    <span>{{ submitError }}</span>
  </div>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <slot :errors :loading />
    <p class="text-xs text-gray-400">
      Current coordinates: {{ formatCoordinates(controlledValues) }}
    </p>
    <p>
      To set the coordinates:
    </p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map.
      </li>
      <li>
        Double click the map.
      </li>
      <li>
        Search for a location below.
      </li>
    </ul>
    <div class="flex justify-end gap-2">
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline"
        @click="router.back()"
      >
        <Icon name="tabler:arrow-left" size="24" />
        Cancel
      </button>
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-else
          :name="props.submitIcon"
          size="24"
        />
        {{ props.submitLabel }}
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
