<template>
  <!-- TODO drag and drop elements -->
  <main class="flex flex-col items-center justify-start gap-4">
    <template v-for="(item, index) in formStore.items">
      <!-- TODO add id to every card so they can be easily navigated-->
      <n-card>
        <template #header-extra>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                text
                :class="'mr-2'"
                @click="formStore.items.splice(index, 1)"
              >
                <n-icon>
                  <SquareXIcon />
                </n-icon>
              </n-button>
            </template>
            Delete
          </n-tooltip>
          <n-tooltip trigger="hover" v-if="index !== 0">
            <template #trigger>
              <n-button
                text
                :class="index !== formStore.items.length - 1 ? 'mr-2' : ''"
                @click="array_move(formStore.items, index, index - 1)"
              >
                <n-icon>
                  <ArrowBigUpLineIcon />
                </n-icon>
              </n-button>
            </template>
            Move up
          </n-tooltip>
          <n-tooltip
            trigger="hover"
            v-if="index !== formStore.items.length - 1"
          >
            <template #trigger>
              <n-button
                text
                @click="array_move(formStore.items, index, index + 1)"
              >
                <n-icon>
                  <ArrowBigDownLineIcon />
                </n-icon>
              </n-button>
            </template>
            Move down
          </n-tooltip>
        </template>

        <template #header>
          <span v-show="!item.editTitle" @click="item.editTitle = true">{{
            item.title
          }}</span>
          <n-input
            v-show="item.editTitle"
            placeholder="Item title"
            v-model:value="item.title"
            @change="item.title.length > 0 ? (item.editTitle = false) : {}"
            @blur="item.title.length > 0 ? (item.editTitle = false) : {}"
          />
          <p
            v-show="!item.editDescription"
            @click="item.editDescription = true"
            :class="
              item.description.length > 0
                ? 'text-gray-700 font-light'
                : 'italic text-gray-500'
            "
            class="text-sm"
          >
            {{ item.description || "Click here to edit item description" }}
          </p>
          <n-input
            v-show="item.editDescription"
            type="textarea"
            placeholder="Enter item description..."
            v-model:value="item.description"
            @blur="item.editDescription = false"
            @change="item.editDescription = false"
          />
        </template>

        <component
          v-bind="item.options"
          v-model:data="item.data"
          :is="item.blockComponent"
        ></component>

        <h5 class="text-md mt-2" v-if="objLength(item.blockOptions) > 0">
          Options:
        </h5>
        <template v-for="(optionValue, optionKey) in item.blockOptions">
          <!--label :for="`${option.label}-${item.id}`">{{ option.label }}</~label-->
          <n-input
            v-if="optionValue.type === 'string'"
            :id="`${optionValue.label}-${item.id}`"
            :autofocus="optionValue.autofocus || false"
            :placeholder="optionValue.label"
            v-model:value="item.options[optionKey]"
          >
          </n-input>
          <template v-else-if="optionValue.type === 'boolean'">
            <n-switch v-model:value="item.options[optionKey]" />
            <label>{{ optionValue.label }}</label>
          </template>
        </template>
      </n-card>
      <!--div--
        @mouseover="addButtons[item.id].mouseOver = true"
        @mouseleave="addButtons[item.id].mouseOver = false"
        class="divider w-full h-24"
      >
        <n-divider
          v-show="addButtons[item.id].mouseOver || addButtons[item.id].clicked"
        >
          <n-popover
            trigger="click"
            :keep-alive-on-hover="true"
            @clickoutside="addButtons[item.id].clicked = false"
          >
            <template #trigger>
              <n-button @click="addButtons[item.id].clicked = true">
                Add block
                <template #icon>
                  <n-icon>
                    <PlusIcon />
                  </n-icon>
                </template>
              </n-button>
            </template>
            <template #header>
              <n-input placeholder="Search..."></n-input>
            </template>
            <template #default>
              <div class="grid grid-cols-3 gap-1 h-28 overflow-y-auto">
                <n-card
                  hoverable
                  class="block-card h-20 p-0"
                  v-for="block in blocks"
                  :key="block.id"
                  @click="add(block)"
                >
                  <div class="flex flex-col justify-center items-center">
                    <n-icon>
                      <component :is="block.icon" />
                    </n-icon>
                    {{ block.name }}
                  </div>
                </n-card>
              </div>
            </template>
          </n-popover>
        </n-divider>
      </!--div-->
    </template>
    <n-popover ref="addpopover" trigger="click" :keep-alive-on-hover="true">
      <template #trigger>
        <n-button secondary strong type="primary" class="mb-4">
          Add block
          <template #icon>
            <n-icon>
              <PlusIcon />
            </n-icon>
          </template>
        </n-button>
      </template>
      <template #header>
        <n-input
          placeholder="Search..."
          :autofocus="true"
          v-model:value="addQuery"
        >
          <template #prefix>
            <n-icon>
              <SearchIcon />
            </n-icon>
          </template>
        </n-input>
      </template>
      <template #default>
        <div class="grid grid-cols-3 gap-1 h-44 overflow-y-auto">
          <n-card
            hoverable
            class="h-20 p-0"
            v-for="block in filteredBlocks"
            :key="block.id"
            @click="add(block)"
          >
            <div class="flex flex-col justify-center items-center">
              <n-icon>
                <component :is="block.icon" />
              </n-icon>
              {{ block.name }}
            </div>
          </n-card>
        </div>
      </template>
    </n-popover>
  </main>
</template>

<script setup lang="ts">
import {
  NCard,
  NInput,
  NDivider,
  NButton,
  NIcon,
  NPopover,
  NSwitch,
  NTooltip,
  useMessage,
} from "naive-ui";
import {
  PlusIcon,
  BoxMultipleIcon,
  ArrowBigUpLineIcon,
  ArrowBigDownLineIcon,
  SearchIcon,
  SquareXIcon,
} from "vue-tabler-icons";
import {
  ref,
  shallowRef,
  ShallowRef,
  watch,
  Ref,
  reactive,
  onMounted,
  computed,
} from "vue";
import blocks from "../blocks";
import { useFormStore } from "../store";

import type { Block, AddButtonStates, VueFormItem, Form } from "../types";

const { form } = defineProps<{
  form: Form;
}>();

const message = useMessage();
const formStore = useFormStore();

console.log(
  "store items",
  Array.isArray(formStore.items),
  formStore.items.length
);

function array_move(arr: Array<any>, old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

const filteredBlocks = computed(() =>
  blocks.filter(
    (block) =>
      block.name.includes(addQuery.value) || block.id.includes(addQuery.value)
  )
);

const addpopover = ref(null);
const addQuery = ref("");

// const items: VueFormItem[] = reactive([]);

const add = (block: Block) => {
  //@ts-ignore
  addpopover.value.setShow(false);
  let options: Record<string, string> = {};
  console.info("hidden and going", options, block.options);
  //@ts-ignore
  for (const [optionKey, optionValue] of Object.entries(block.options || {})) {
    console.log(`Process option ${optionKey} with value ${optionValue}`);
    //@ts-ignore
    if (optionValue.required && optionValue.default === undefined) {
      message.error("Block is not properly defined");
      return;
    }
    options[optionKey] = optionValue.default;
    console.info("option", optionKey, optionValue, " -> ", options[optionKey]);
  }
  console.info("options fixed", options);
  const item: VueFormItem = {
    id: `${block.id}${block.counter}`,
    title: `${block.name} #${block.counter}`,
    description: "",
    type: `${block.id}`,
    options,
    data: {} as Record<string, string>,
    editTitle: false,
    editDescription: false,
    blockOptions: block.options || {},
    blockComponent: block.component,
  };
  console.info("lets add item", item);
  formStore.items.push(item);
  block.counter++;
};

const objLength = (it: any): number => {
  return Object.keys(it || {}).length;
};
</script>

<style>
.n-divider__line {
  background: red;
}

.n-card-header {
  align-items: flex-start !important;
}

.n-card-header__extra {
  margin-top: 0.4rem;
}
</style>
