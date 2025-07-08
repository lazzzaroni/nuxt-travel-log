<script lang="ts" setup>
defineProps<{
  label: string;
  name: string;
  type?: HTMLInputElement["type"] | "textarea";
  error?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      :as="type === 'textarea' ? 'textarea' : 'input'"
      :name="name"
      :type="type || 'text'"
      class="w-full"
      :class="{
        'input-error': error,
        'input': !type || type !== 'textarea',
        'textarea': type === 'textarea',
      }"
      :disabled="disabled"
    />
    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>

<style>

</style>
