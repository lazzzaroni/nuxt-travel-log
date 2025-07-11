import tailwindcss from "@tailwindcss/vite";

import "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "nuxt-csurf",
    "nuxt-maplibre",
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ["vue", "vue-router", "@vue/shared", "maplibre-gl"],
    },
  },
  colorMode: {
    dataValue: "theme",
  },
  nitro: {
    experimental: {
      wasm: false,
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  build: {
    transpile: ["vue", "vue-router"],
  },
  ssr: true,
});
