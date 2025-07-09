<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { locationInsertSchema } from "~/lib/db/schema";

const router = useRouter();
const loading = ref(false);
const submitted = ref(false);

const submitError = ref<string | null>(null);

const { $csrfFetch } = useNuxtApp();

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(locationInsertSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = null;
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "POST",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data.data) {
      setErrors(error.data.data);
    }
    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occurred.";
  }
  finally {
    loading.value = false;
  }
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?");
    if (!confirm) {
      return false; // Prevent navigation
    }
  }
  return true; // Allow navigation
});
</script>

<template>
  <div class="container mx-auto max-w-md">
    <div class="my-4">
      <h1 class="text-lg font-bold">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <AppFormField
        :disabled="loading"
        label="Name"
        name="name"
        :error="errors.name"
      />
      <AppFormField
        :disabled="loading"
        label="Description"
        name="description"
        type="textarea"
        :error="errors.description"
      />
      <AppFormField
        :disabled="loading"
        label="Latitude"
        name="lat"
        type="number"
        :error="errors.lat"
      />
      <AppFormField
        :disabled="loading"
        label="Longitude"
        name="long"
        type="number"
        :error="errors.long"
      />
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back()"
        >
          <Icon name="tabler:x" size="24" />
          Cancel
        </button>
        <button :disabled="loading" type="submit" class="btn btn-primary">
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon v-else name="tabler:circle-plus-filled" size="24" />
          Add
        </button>
      </div>
    </form>
  </div>
</template>

<style>

</style>
