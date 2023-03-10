import PocketBase from "pocketbase";

export default defineNuxtPlugin(async (nuxtApp) => {
  const pb = new PocketBase("http://127.0.0.1:8090");

  // load the store data from the request cookie string
  pb.authStore.loadFromCookie(
    nuxtApp.ssrContext?.event?.req?.headers?.cookie || ""
  );

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    if (nuxtApp.ssrContext?.event?.res) {
      nuxtApp.ssrContext.event.res.setHeader(
        "set-cookie",
        pb.authStore.exportToCookie()
      );
    }
  });

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return {
    provide: { pb },
  };
});
