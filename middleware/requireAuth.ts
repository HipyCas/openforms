export default defineNuxtRouteMiddleware((to, from) => {
  const { $pb } = useNuxtApp();
  if (!$pb.authStore.isValid) {
    return navigateTo("/auth/login");
  }
});
