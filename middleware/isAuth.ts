import PocketBase from "pocketbase";

export default defineNuxtRouteMiddleware((to, from) => {
  let pb = inject(PB_KEY);
  if (pb === undefined) {
    pb = new PocketBase("http://127.0.0.1:8090");
    provide(PB_KEY, pb);
  }
  if (pb.authStore.isValid) {
    return navigateTo("/");
  }
});
