import Equal from "equal-vue";

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.hook("components:dirs", (dirs) => {})
  nuxtApp.vueApp.use(Equal);

  return {
    provide: {
      // loading: nuxtApp.vueApp.config.globalProperties.$Loading,
      message: nuxtApp.vueApp.config.globalProperties.$Message,
      notification: nuxtApp.vueApp.config.globalProperties.$Notification,
    },
  };
});
