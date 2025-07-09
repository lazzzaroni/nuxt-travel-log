<script lang="ts" setup>
const isSidebarOpen = ref(true);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen.value));
}

onMounted(() => {
  const storedState = localStorage.getItem("isSidebarOpen");
  if (storedState !== null) {
    isSidebarOpen.value = JSON.parse(storedState);
  }
});
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex">
        <button class="btn btn-ghost w-full p-2 h-12" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
          <Icon
            v-if="isSidebarOpen"
            name="tabler:chevron-left"
            size="32"
            class="self-end"
          />
          <Icon
            v-else
            name="tabler:chevron-right"
            size="32"
            class="self-end"
          />
        </button>
      </div>
      <div class="flex flex-col">
        <SidebarButton
          :show-label="isSidebarOpen"
          icon="tabler:map"
          label="Locations"
          to="/dashboard"
        />
        <SidebarButton
          :show-label="isSidebarOpen"
          icon="tabler:circle-plus-filled"
          label="Add Location"
          to="/dashboard/add"
        />
        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          icon="tabler:logout-2"
          label="Sign Out"
          to="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

<style>

</style>
