import Message from "equal-vue/src/components/message/index";
import Loading from "equal-vue/src/components/loading/index";

declare module "#app" {
  interface NuxtApp {
    $loading: typeof Loading;
    $message: typeof Message;
  }
}
