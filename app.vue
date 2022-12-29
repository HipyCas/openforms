<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { provide } from "vue";

import dayjs from "dayjs";
import relativeTimeDayjs from "dayjs/plugin/relativeTime";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";

import PocketBase from "pocketbase";

dayjs.extend(relativeTimeDayjs);
provide(DAYJS_KEY, dayjs);

hljs.registerLanguage("javascript", javascript); // TODO Use provide/inject for hljs
hljs.registerLanguage("typescript", typescript);
provide(HLJS_KEY, hljs);

// const nuxtApp = useNuxtApp();

// onMounted(() => {
//   nuxtApp.vueApp.$nuxt.hook("page:start", nuxtApp.$loading.start);
//   nuxtApp.hook("page:finish", nuxtApp.$loading.finish);
// });

// nuxtApp.$loading.start();
</script>

<style>
.header {
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
}

.input-toggle {
  margin-right: 0.5rem !important;
}
</style>
