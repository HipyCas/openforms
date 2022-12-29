<template>
  <div
    class="flex flex-col items-center justify-center h-screen w-screen"
    v-show="loading_"
  >
    <it-loading></it-loading>
    <ClientOnly
      ><span class="mt-4 font-[Inter]"
        >Loading form{{ formName }}...</span
      ></ClientOnly
    >
  </div>
  <Form :form="(form as Form)" v-show="!loading_"></Form>
  <div class="fixed bottom-4 w-screen p-0 m-0 flex justify-center items-center">
    <it-alert
      v-show="!online"
      type="warning"
      title="You're offline"
      body="Work will be saved locally in your browser an updated when you regain connection"
    ></it-alert>
  </div>
</template>

<script setup lang="ts">
import type PocketBase from "pocketbase";
import type { Ref } from "vue";
import type { Form } from "~~/types";

const pb = inject(PB_KEY) as PocketBase;
const route = useRoute();

const id = route.params.id;
const name = route.query.new;
const formName = name === undefined ? "" : " " + name;

const form: Ref<{} | Form> = ref({});
const loading_ = ref(true);

console.log(id, name, "loadddd is", loading_.value, loading_);

try {
  form.value = await pb.collection("forms").getOne(id as string);
} catch (e) {
  console.warn(e);
}
console.log("asynching");
console.info("form", form.value);
setTimeout(() => (loading_.value = false), 30000);

const online = useOnline();

// onMounted(() => {
//   window.addEventListener("offline", (e) => (online.value = false));
//   window.addEventListener("oline", (e) => (online.value = true));
// });
</script>
