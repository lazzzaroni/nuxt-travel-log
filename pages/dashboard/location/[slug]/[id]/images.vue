<script lang="ts" setup>
import { FetchError } from "ofetch";

const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
} = storeToRefs(locationStore);

const route = useRoute();
const { $csrfFetch } = useNuxtApp();

const imageInput = useTemplateRef<HTMLInputElement>("imageInput");
const image = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref("");

function selectImage(event: Event) {
  errorMessage.value = "";
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (file.type !== "image/jpeg") {
      errorMessage.value = "Only JPEG images are allowed.";
      image.value = null;
      previewUrl.value = null;
      if (imageInput.value) {
        imageInput.value.value = "";
      }
      return;
    }
    image.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
  else {
    image.value = null;
    previewUrl.value = null;
  }
}

async function uploadImage() {
  if (!image.value || !previewUrl.value)
    return;

  loading.value = true;
  errorMessage.value = "";

  const previewImage = new Image();
  previewImage.addEventListener("load", async () => {
    const width = Math.min(1000, previewImage.width);
    const resized = await createImageBitmap(previewImage, {
      resizeWidth: width,
    });
    const canvas = new OffscreenCanvas(width, resized.height);
    canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.9,
    });

    async function getChecksum(blob: Blob): Promise<string> {
      const arrayBuffer = await blob.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    }

    const checksum = await getChecksum(blob);

    try {
      const { fields, key, url } = await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/sign-image`, {
        method: "POST",
        body: {
          contentLength: blob.size,
          checksum,
        },
      });

      const formData = new FormData();

      Object.entries(fields).forEach(([name, value]) => {
        formData.append(name, value as string);
      });
      formData.append("file", blob);

      $fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "x-amz-checksum-algorithm": "SHA256",
        },
      });

      await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}/image`, {
        method: "POST",
        body: {
          key,
        },
      });

      await locationStore.refreshCurrentLocationLog();
      image.value = null;
      previewUrl.value = null;
      if (imageInput.value) {
        imageInput.value.value = "";
      }
    }
    catch (e) {
      if (e instanceof FetchError) {
        errorMessage.value = (e as FetchError).statusMessage || "Unknown Error";
      }
      else if (e instanceof Error) {
        errorMessage.value = (e as Error).message;
      }
      else {
        errorMessage.value = "Unknown Error";
      }
    }

    loading.value = false;
  });
  previewImage.src = previewUrl.value;
}
</script>

<template>
  <div class="">
    <h2 class="mb-2">
      Manage "{{ locationLog?.name || 'Loading...' }}" images
    </h2>
    <div class="flex">
      <div class="flex gap-2 flex-col w-72">
        <div class="bg-gray-500 h-28 w-full flex justify-center items-center p-1 relative">
          <p v-if="!previewUrl && !errorMessage" class="text-center text-white">
            Select image
          </p>
          <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="upload preview"
            class="h-full object-cover"
          >
          <div v-if="loading || errorMessage" class="size-full absolute flex justify-center items-center bg-black opacity-50">
            <div v-if="loading" class="loading loading-lg" />
            <p v-if="errorMessage" class="error">
              {{ errorMessage }}
            </p>
          </div>
        </div>
        <input
          ref="imageInput"
          type="file"
          class="file-input"
          :disabled="loading"
          @change="selectImage"
        >
        <button class="btn btn-primary" :disabled="!image || loading" @click="uploadImage">
          Upload
          <Icon name="tabler:photo-share" size="24" />
        </button>
      </div>
      <ImageList class="ml-4" :images="locationLog?.images || []" />
    </div>
  </div>
</template>

<style>

</style>
