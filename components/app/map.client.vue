<script lang="ts" setup>
import { LODZ } from "~/lib/constants";

// maputnik - to style tiles

const colorMode = useColorMode();

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const zoom = 6;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="LODZ"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

<style>

</style>
