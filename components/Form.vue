<template>
  <n-page-header @back="" class="p-4">
    <!-- MAIN CONTENT -->
    <div class="p-2">
      <ClientOnly>
        <it-tabs class="flex justify-between" id="tabs">
          <!-- <n-tab-pane name="edit" tab="Edit">
            <span v-if="loading">Loading...</span>
            <KeepAlive>
              <Editor :form="form" />
            </KeepAlive>
          </n-tab-pane> -->
          <it-tab title="Edit" class="pt-4"
            ><KeepAlive> <Editor :form="form" /> </KeepAlive
          ></it-tab>
          <it-tab title="Answers"> Hey Jude </it-tab>
          <it-tab title="Settings">
            <KeepAlive>
              <FormSettings :form="form"></FormSettings>
            </KeepAlive>
          </it-tab>
        </it-tabs>
      </ClientOnly>
    </div>
    <template #back>
      <router-link to="/">
        <it-icon name="arrow_back"></it-icon>
      </router-link>
    </template>
    <template #title>
      <!-- TODO Toggle focus when clicked programmatically as specified in docs -->
      <it-button-group v-if="editName">
        <it-input
          ref="titleInput"
          :modelValue="formTitle"
          :autofocus="true"
          @change="editName = false"
          @update:modelValue="updateFormTitle($event)"
        ></it-input>
        <it-button @click="editName = false">Save</it-button>
      </it-button-group>
      <it-tooltip v-else placement="bottom" content="Click to edit"
        ><span @click="editName = true">{{ formTitle }}</span></it-tooltip
      >
    </template>
    <template #subtitle>
      <ClientOnly>
        <it-tooltip placement="bottom" content="Click here to save">
          <span @click="save()">Saved {{ lastSaved }}</span>
        </it-tooltip>
      </ClientOnly>
    </template>
    <template #avatar>
      <it-icon
        box
        box-color="#3051ff"
        color="#fff"
        name="drive_file_rename_outline"
      >
      </it-icon>
    </template>
    <template #extra>
      <ClientOnly>
        <n-space>
          <it-button icon="visibility"> Preview </it-button>
          <n-dropdown :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px"> ··· </n-button>
          </n-dropdown>
        </n-space>
      </ClientOnly>
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
import {
  NButton,
  NIcon,
  NPageHeader,
  NGrid,
  NGi,
  NStatistic,
  NBreadcrumb,
  NBreadcrumbItem,
  NAvatar,
  NSpace,
  NDropdown,
  NTabs,
  NTabPane,
  NBackTop,
  NInput,
  NInputGroup,
  NTooltip,
  useMessage,
} from "naive-ui";
import {
  UserIcon,
  FormsIcon,
  MenuIcon,
  EyeIcon,
  ArrowLeftIcon,
} from "vue-tabler-icons";
import Editor from "./FormEditor.vue";
import { useFormStore } from "~~/store";
import type { VueForm, FormItem, Form, BaseForm, DBUpdateForm } from "~~/types";
import type { DAYJS_TYPE } from "~~/utils";
import type PocketBase from "pocketbase";
import { VOnClickOutside } from "@vueuse/components";

const props = defineProps<{
  form: Form;
}>();
console.info("PROPPED FORM", props.form);
// setInterval(() => console.info("PROPPED FORM", props.form), 500);

const formTitle = ref(props.form.title);

const loading = ref(true);

const dayjs = inject(DAYJS_KEY) as DAYJS_TYPE;
const pb = inject(PB_KEY) as PocketBase;

const message = useMessage();
const formStore = useFormStore();

const titleInput = ref(null);
onClickOutside(titleInput, (event) =>
  editName.value ? (editName.value = false) : {}
);

// const lastSaved = computed(() => {
//   return dayjs(formStore.lastSaved).from(dayjs());
// });
const lastSaved = ref(dayjs(formStore.lastSaved).from(dayjs()));
setInterval(
  () => (lastSaved.value = dayjs(formStore.lastSaved).from(dayjs())),
  1000
);

let sidebarOpen = ref(false);
let formName = ref("Untitled form");

let editName = ref(false);
// let fileName = ref("Unnamed");

const options = [
  {
    label: "More episodes",
    key: "1",
  },
  {
    label: "More episodes",
    key: "2",
  },
  {
    label: "More episodes",
    key: "3",
  },
];

const save = () => {
  saveForm(formStore.$state);
  message.success("Form saved!");
};

watch(
  formStore.$state,
  (state) => {
    console.log("saved form", JSON.stringify(state));
    if (!loading.value) saveForm(state);
  },
  { deep: true }
);

function saveForm(state: VueForm) {
  let copy = {
    // fileName: state.fileName,
    lastSaved: new Date(),
    title: state.title,
    description: state.description,
    items: state.items.map(
      ({ id, title, description, type, data, options }) =>
        ({
          id,
          title,
          description,
          type,
          data,
          options,
        } as FormItem)
    ),
    settings: state.settings,
    // answers: state.answers,
  };
  console.info("copyitems", copy.items);
  // persist the whole state to the local storage whenever it changes
  localStorage.setItem(`OpenFormsSave.${props.form.id}`, JSON.stringify(copy));
  lastSaved.value = dayjs(copy.lastSaved).from(dayjs());
  saveFormToDB(state);
}

function saveFormToDB(state: VueForm) {
  const updated: DBUpdateForm = {
    title: formTitle.value,
    lastSaved: new Date(),
    description: "",
    items: state.items.map(
      ({ id, title, description, type, data, options }) =>
        ({
          id,
          title,
          description,
          type,
          data,
          options,
        } as FormItem)
    ),
    accessFill: state.settings.access.fill,
    accessEdit: state.settings.access.edit,
  };
  console.info("UPDATING FORM IN DB");
  pb.collection("forms").update(props.form.id, updated);
}
// watch(formTitle, (val) => {
//   console.log("mmmmmmmm", val);
//   pb.collection("forms")
//     .update(
//       props.form.id,
//       {
//         title: val,
//       },
//       {
//         $autoCancel: false,
//       }
//     )
//     .then((f) => (formTitle.value = f.title));
// });

const updateFormTitle = (value: string) => {
  console.info("updating form title", value);
  pb.collection("forms")
    .update(
      props.form.id,
      {
        title: value,
      },
      {
        $autoCancel: false,
      }
    )
    .then(
      (f) => (
        console.log("updated form title", f.title), (formTitle.value = f.title)
      )
    );
};

// pb.collection("forms").subscribe(props.form.id, function (e) {
//   console.log(e.record);
//   formTitle.value = e.record.title;
//   console.log(formTitle);
// });

onMounted(() => {
  formStore.fromLocalStorage(pb, props.form.id);
  // formStore.$state = { ...props.form };
  loading.value = false;

  let handle: number;
  handle = window.setInterval(() => {
    console.info("checking for name");
    formTitle.value = props.form.title;
    console.info(
      "formtitle",
      formTitle.value,
      formTitle.value !== undefined,
      formTitle.value !== "",
      formTitle.value !== undefined && formTitle.value !== ""
    );
    if (formTitle.value !== undefined && formTitle.value !== "")
      window.clearInterval(handle);
  }, 100);
});
</script>

<style>
#tabs > .it-tabs-header {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 2rem;
}
#tabs > .it-tabs-header > .it-tabs-tab {
  flex-grow: 1;
}
</style>
