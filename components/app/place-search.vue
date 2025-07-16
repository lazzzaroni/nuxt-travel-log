<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";
import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResults = ref<Array<NominatimResult>>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  loading.value = true;
  hasSearched.value = true;
  errorMessage.value = "";
  searchResults.value = [];
  try {
    const results = await $fetch("/api/search", {
      query,
    });
    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResults.value = [];
  errorMessage.value = "";
  hasSearched.value = false;
  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              placeholder="Search for a location..."
              :class="{
                'input-error': errors.q,
              }"
              :disabled="loading"
            />
          </label>
          <div v-if="errors.q" class="validator-hint text-error visible">
            {{ errors.q }}
          </div>
        </div>
        <button
          class="btn btn-neutral join-item"
          :disabled="loading"
        >
          Search
        </button>
      </div>
    </Form>

    <div v-if="!loading && errorMessage" role="alert" class="alert alert-error">
      <span>{{ errorMessage }}</span>
    </div>
    <div v-if="!loading && hasSearched && !searchResults.length" role="alert" class="alert alert-warning">
      <span>No results found</span>
    </div>

    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>

    <div class="flex flex-col overflow-auto gap-2 max-h-60 mt-4">
      <div v-for="result in searchResults" :key="result.place_id" class="card bg-base-100 card-sm">
        <div class="card-body">
          <h3 class="card-title">
            {{ result.display_name }}
          </h3>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              <Icon name="tabler:map-pin-share" size="20" />
              Set Location
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
