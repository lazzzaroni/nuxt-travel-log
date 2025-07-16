<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps <{
  icon: string;
  label: string;
  to?: RouteLocationRaw;
  href?: string;
  showLabel?: boolean;
  iconColor?: "text-accent" | "text-secondary" | "text-primary";
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.to);
</script>

<template>
  <div class="tooltip-right" :data-tip="showLabel ? undefined : label" :class="{ tooltip: !props.showLabel }">
    <NuxtLink :to="props.href || props.to" class="flex gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap" :class="{ 'bg-base-200': isActive, 'justify-center': !props.showLabel, 'justify-start': props.showLabel }">
      <Icon :name="props.icon" size="24" :class="props.iconColor" />
      <Transition name="grow">
        <span v-if="props.showLabel">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.2s;
}
.grow-leave-active {
  animation: grow 0.2s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
