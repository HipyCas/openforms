<template>
  <main class="flex items-center justify-center h-screen w-screen bg-slate-50">
    <n-card title="Signup" class="w-[50%] shadow-sm">
      <p class="-mt-3">
        Create your account now and start making awesome forms
      </p>
      <form @submit.prevent="register">
        <n-input placeholder="Email" class="mb-4 mt-6" v-model:value="email">
          <template #prefix>
            <n-icon :component="MailIcon"></n-icon>
          </template>
        </n-input>
        <n-input
          placeholder="Password"
          type="password"
          show-password-on="click"
          v-model:value="password"
        >
          <template #prefix>
            <n-icon :component="LockIcon"></n-icon>
          </template>
        </n-input>
        <n-button
          attr-type="submit"
          color="#36AD6A"
          class="w-full mt-4"
          :loading="signupLoading"
          >Register</n-button
        >
        <NuxtLink to="/auth/login">
          <n-button quaternary type="primary" class="w-full mt-1">
            Already have an account? Log in
          </n-button>
        </NuxtLink>
      </form>
    </n-card>
  </main>
</template>

<script setup lang="ts">
import { NCard, NInput, NIcon, NButton, useMessage } from "naive-ui";
import { MailIcon, LockIcon } from "vue-tabler-icons";
import type pocketbaseEs from "pocketbase";

definePageMeta({
  middleware: "is-auth",
});

const pb = inject(PB_KEY) as pocketbaseEs;

const message = useMessage();
const router = useRouter();

const email = ref("");
const password = ref("");
const signupLoading = ref(false);

const register = async () => {
  console.info("hi", password.value);
  signupLoading.value = true;
  const res = await pb.collection("users").create({
    username: email.value.split("@")[0],
    email: email.value,
    password: password.value,
    passwordConfirm: password.value,
  });
  message.success("Account created");
  setTimeout(() => router.push("/auth/login"), 500);
};
</script>
