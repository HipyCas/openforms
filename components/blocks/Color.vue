<template>
  <n-color-picker
    :show-alpha="showAlpha"
    :show-preview="showPreview"
    v-model:value="data.color"
    @update:value="emit('update:data', data)"
  ></n-color-picker>
</template>

<script setup lang="ts">
import { NColorPicker } from "naive-ui";

import { defineProps, toRefs, watch } from "vue";

const props = defineProps<{
  showAlpha: boolean;
  showPreview: boolean;
  data: any;
}>();

const emit = defineEmits(["update:data"]);

const { showAlpha, showPreview } = toRefs(props);

console.log(props);

// watch(showAlpha, () =>
//   console.log("change props", showAlpha.value, showPreview.value)
// );
</script>
