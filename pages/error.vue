<script lang="ts" setup>
const route = useRoute();

const error = computed(() => {
  return route.query.error || "An unexpected error occurred.";
});
</script>

<template>
  <div class="card bg-base-300 container mt-4 min-h-72 text-center mx-auto flex flex-col justify-center items-center gap-4">
    <div role="alert" class="alert alert-error min-w-1/2 text-center">
      <span>Oh no! {{ error }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary">
      Home
      <Icon name="tabler:arrow-left" size="24" />
    </NuxtLink>
  </div>
</template>

<style>

</style>
