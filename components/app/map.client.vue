// maputnik - to style tiles

<script lang="ts" setup>
import { LODZ } from "~/lib/constants";

const mapStore = useMapStore();

const colorMode = useColorMode();

const style = computed(() => {
  return colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty";
});
const zoom = 6;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="LODZ"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div class="tooltip tooltip-top" :data-tip="point.label">
          <Icon name="tabler:map-pin-filled" size="30" class="text-secondary" />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>

<style>

</style>
