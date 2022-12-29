<template>
  <!-- TODO What you can do for when filling/displaying the form is creating the blocks/Code.edit.vue, which would be this and loaded when editing the form, and blocks/Code.fill.vue, which would be loaded when filling out the form (other options: blocks/code/Edit.vue & blocks/Code/Fill.vue, blocks/edit/Code.vue & blocks/fill/Code.vue) -->
  <div v-show="edit">
    <n-input
      v-model:value="data.code"
      type="textarea"
      @input="emit('update:data', data)"
      @change="edit = false"
      @blur="edit = false"
    ></n-input>
    <n-button @click="edit = false">Save</n-button>
  </div>
  <n-tooltip v-show="!edit">
    <template #trigger>
      <n-code
        :language="language"
        :code="data.code"
        @click="edit = true"
        :hljs="hljs"
      ></n-code>
    </template>
    Click to edit
  </n-tooltip>
</template>

<script setup lang="ts">
import { NCode, NInput, NButton, NTooltip, NInputGroup } from "naive-ui";

import { defineProps, ref, watch, toRefs, inject } from "vue";

// import { HLJS_KEY } from "../../symbol";

interface CodeData {
  code: string;
}

const hljs = inject(HLJS_KEY);
console.log(hljs);

let props = defineProps<{
  language?: string;
  data: CodeData;
}>();

if (props.data.code === "" || props.data.code === undefined)
  props.data.code = "// Type some code";

let emit = defineEmits(["update:data"]);

let { language } = toRefs(props);

const edit = ref(false);

const code = ref("// Type some code");

// TODO Add loading state to button and/or input
// FIXME This doesn't work, add to build time or as somehow configuration
// TODO For configuration, https://blog.container-solutions.com/deploying-configurable-frontend-web-application-containers
// const loadLang = async () => {
//   const lang = await import(
//     `highlight.js/lib/languages/${languageToLoad.value}`
//   );
//   hljs.registerLanguage(languageToLoad.value, lang);
// };
</script>
