<script lang="ts" setup>
const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.preference === "dark",
  set: (value) => {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <label class="swap swap-rotate mx-4">
    <!-- this hidden checkbox controls the state -->
    <input v-model="isDark" type="checkbox">

    <!-- sun icon -->
    <Icon name="tabler:sun" class="swap-on" size="24" />

    <!-- moon icon -->
    <Icon name="tabler:moon-filled" class="swap-off" size="24" />
  </label>
</template>

<style>

</style>
