<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  value: number;
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,
  validateOnMount: true,
});

function formatDateISO(value: number) {
  return new Date(value).toISOString().split("T")[0];
}

function handleDateChange(event: Event) {
  const target = event.target as HTMLInputElement;
  handleChange(new Date(target.value).getTime());
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <input
      :name="name"
      type="date"
      class="w-full input"
      :class="{
        'input-error': error,
      }"
      :value="formatDateISO(inputValue)"
      :disabled="disabled"
      @change="handleDateChange"
      @blur="handleBlur"
    >
    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>

<style>

</style>
