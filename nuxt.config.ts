// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    // "@nuxtjs/google-fonts",
  ],
  css: ["equal-vue/dist/style.css"],
  tailwindcss: {
    injectPosition: 0,
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined",
        },
      ],
    },
  },
});
