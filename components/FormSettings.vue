<template>
  <n-card>
    <template #header> Access </template>
    <n-space vertical>
      <!-- TODO Make this a functional component (https://blog.logrocket.com/how-to-use-stateless-components-in-vue-js/)-->
      <div class="flex flex-row justify-between gap-2">
        <p class="w-min-content shrink-0 text-lg text-[1rem]">Fill access</p>
        <n-select
          class="min-w-[20rem] w-auto"
          v-model:value="formStore.settings.access.fill"
          :options="accessFillOptions"
        ></n-select>
      </div>
      <div class="flex flex-row justify-between gap-2">
        <p class="w-min-content shrink-0 text-lg text-[1rem]">Edit access</p>
        <n-select
          class="min-w-[20rem] w-auto"
          v-model:value="formStore.settings.access.edit"
          :options="accessFillOptions"
        ></n-select>
      </div>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NSelect, NText } from "naive-ui";
import { useFormStore } from "~~/store";

import { AccessType, Form } from "~~/types";

defineProps<{
  form: Form;
}>();

const formStore = useFormStore();

const accessFillOptions = [
  {
    label: "Just me",
    value: AccessType.PRIVATE,
  },
  {
    label: "Anyone with an account",
    value: AccessType.LOGIN_ANYONE,
  },
  {
    label: "Only some with account",
    value: AccessType.LOGIN_WHITELIST,
  },
  {
    label: "Anyone with account except some",
    value: AccessType.LOGIN_BLACKLIST,
  },
  {
    label: "Anyone who verifies an email",
    value: AccessType.VERIFIED_EMAIL,
  },
  {
    label: "Anyone who verifies a phone number",
    value: AccessType.VERIFIED_NUMBER,
  },
  {
    label: "Anyone on the internet",
    value: AccessType.PUBLIC,
  },
];
</script>
