export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@nuxtjs/tailwindcss"],
  css: ["@/assets/css/tailwind.scss"],
  tailwindcss: {
    viewer: false,
  },
});
