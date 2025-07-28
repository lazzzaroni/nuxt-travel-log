<script lang="ts" setup>
const props = defineProps<{
  isOpened: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: "btn-warning" | "btn-error" | "btn-accent" | "btn-primary";
}>();

const emit = defineEmits<{
  onClosed: [];
  onConfirmed: [];
}>();

const dialogRef = useTemplateRef<HTMLDialogElement>("dialog");

function onClose() {
  emit("onClosed");
}

function onConfirm() {
  emit("onConfirmed");
  onClose();
}

onMounted(() => {
  dialogRef.value?.addEventListener("close", onClose);
});

onUnmounted(() => {
  dialogRef.value?.removeEventListener("close", onClose);
});
</script>

<template>
  <dialog ref="dialogRef" class="modal" :open="props.isOpened">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ title }}
      </h3>
      <p class="py-4">
        {{ description }}
      </p>
      <div class="flex justify-end gap-2">
        <button class="btn btn-outline" @click="onClose">
          Cancel
        </button>
        <button class="btn" :class="props.confirmClass" @click="onConfirm">
          {{ props.confirmLabel }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<style>

</style>
