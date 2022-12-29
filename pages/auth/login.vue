<template>
  <main class="flex items-center justify-center h-screen w-screen bg-slate-50">
    <n-card title="Login" class="w-[90%] md:w-[50%] shadow-sm font-[Inter]">
      <p class="-mt-3">Login to access your forms</p>
      <form @submit.prevent="access">
        <div class="mb-4 mt-6">
          <ClientOnly>
            <it-input
              placeholder="Email or username"
              v-model="email"
              prefix-icon="person"
              :disabled="accessLoading"
            >
            </it-input>
          </ClientOnly>
        </div>
        <ClientOnly>
          <it-input
            placeholder="Password"
            type="password"
            show-password-on="click"
            prefix-icon="password"
            v-model="password"
            :disabled="accessLoading"
          >
          </it-input>
        </ClientOnly>
        <ClientOnly>
          <it-button
            attr-type="submit"
            type="primary"
            class="w-full mt-4"
            :loading="accessLoading"
            >Access</it-button
          >
        </ClientOnly>
        <NuxtLink to="/auth/signup">
          <ClientOnly>
            <it-button text type="primary" class="w-full mt-2">
              New here? Register
            </it-button>
          </ClientOnly>
        </NuxtLink>
      </form>
      <it-button @click="testFetch">Test Fetch</it-button>
    </n-card>
  </main>
</template>

<script setup lang="ts">
import pocketbaseEs from "pocketbase";
// import { $message } from "#app";
// import ItButton from "@/node_modules/equal-vue/src/components/button/ItButton.vue";
// import ItInput from "@/node_modules/equal-vue/src/components/input/ItInput.vue";
// import ItIcon from "@/node_modules/equal-vue/src/components/icon/ItIcon.vue";
definePageMeta({
  middleware: "is-auth",
});

useHead({
  meta: [{ name: "naive-ui-style" }],
});

const { $message, $pb } = useNuxtApp();

const router = useRouter();

const email = ref("");
const password = ref("");
const accessLoading = ref(false);

if ($pb.authStore.isValid) router.push("/");

const access = async () => {
  accessLoading.value = true;
  try {
    console.info("asked for login");
    await $pb.collection("users").authWithPassword(email.value, password.value);
    $message.success({ text: "Successfully logged in", duration: 2000 });
    setTimeout(() => {
      console.info("que?");
      router.push("/");
      console.info("lol");
    }, 300);
    console.log("timed out");
  } catch (e) {
    console.error("didnt want to login", e);
    $message.danger({
      text: "Could not login, check email and password",
      duration: 2000,
    });
    accessLoading.value = false;
  }
};

const testFetch = () => {
  useFetch("http://127.0.0.1:8090/api/collections/users/records")
    .then((res) => console.info(res))
    .catch((e) => console.error("fetch test error", e));
};
</script>
