import NaiveUI from "naive-ui";

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.hook("components:dirs", (dirs) => {})
  nuxtApp.vueApp.use(NaiveUI);
});
