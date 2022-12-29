<template>
  <n-page-header class="px-4 pt-4">
    <main
      :style="
        pending
          ? 'width: 97vw;height: 78vh;display: flex;align-items: center;justify-content: center;'
          : 'grid grid-cols-3 gap-4'
      "
    >
      <n-spin v-if="pending">
        <template #description>Loading forms...</template>
      </n-spin>
      <n-empty
        v-if="forms !== null && forms.length === 0"
        description="No forms yet"
      >
        <template #extra>
          <n-button size="small" @click="createForm">
            Create one now!
          </n-button>
        </template>
      </n-empty>
      <template v-else>
        <div
          class="w-full grid grid-cols-1 md:grid-cols-3 gap-4 grid-flow-row-dense justify-items-stretch"
        >
          <NuxtLink :to="`/edit/${form.id}`" v-for="form in forms">
            <n-card
              class="cursor-pointer"
              @_click="router.push(`/edit/${form.id}`)"
            >
              <template #header>{{ form.title }}</template>
              <template #header-extra>
                <it-dropdown>
                  <it-button icon="more_vert" text @click.prevent />
                  <template #menu>
                    <it-dropdown-menu>
                      <it-dropdown-item
                        class="text-[#F93155] hover:!bg-[#F93155]"
                        @click.prevent="confirmDeleteForm(form.title, form.id)"
                        icon="delete"
                        >Delete</it-dropdown-item
                      >
                    </it-dropdown-menu>
                  </template>
                </it-dropdown>
              </template>
            </n-card>
          </NuxtLink>
        </div>
      </template>
      <!-- <div class="fixed bottom-5">
        <it-button
          icon="add"
          type="primary"
          class="scale-125"
          @click="createForm"
          :pulse="forms?.length === 0"
        >
          Create new
        </it-button>
      </div> -->
    </main>
    <template #title><span>OpenForms</span></template>
    <template #avatar>
      <n-avatar class="bg-indigo-600">
        <n-icon>
          <FormsIcon />
        </n-icon>
      </n-avatar>
    </template>
    <template #extra>
      <div class="flex flex-row gap-3">
        <it-button
          icon="add"
          type="primary"
          size="small"
          class="scale-90"
          @click="createForm"
          :pulse="forms?.length === 0"
          :loading="creatingForm"
          v-if="isMobile !== undefined && !isMobile"
        >
          Create new
        </it-button>
        <it-dropdown placement="bottom-right">
          <Avatar
            class="m-0 p-0"
            variant="beam"
            :square="false"
            :name="pb.authStore.model?.email"
          ></Avatar>
          <template #menu>
            <it-dropdown-menu>
              <it-dropdown-item
                class="text-[#F93155] hover:!bg-[#F93155]"
                @click.prevent="
                  pb.authStore.clear(), router.push('/auth/login')
                "
                icon="logout"
                >Log out</it-dropdown-item
              >
            </it-dropdown-menu>
          </template>
        </it-dropdown>
      </div>
    </template>
  </n-page-header>
  <div class="fixed bottom-6 left-0 w-screen flex justify-center items-center">
    <it-button
      icon="add"
      type="primary"
      size="small"
      class="scale-125"
      @click="createForm"
      :pulse="forms?.length === 0"
      :loading="creatingForm"
      v-if="isMobile !== undefined && isMobile"
    >
      Create new
    </it-button>
  </div>
  <it-modal v-model="showDeleteConfirmationModal">
    <template #header>
      <h3>Delete form?</h3>
    </template>
    <template #body>
      Form <em class="italic">{{ formNameToDelete }}</em> (<code
        class="font-mono bg-slate-200 px-0.5 py-0.5 rounded"
      >
        {{ formIdToDelete }}</code
      >) will be permanently deleted along with its answers and users to whom
      you have shared the form will also loose access
    </template>
    <template #actions>
      <it-button
        @click="showDeleteConfirmationModal = false"
        :disabled="deletingForm"
        >Cancel</it-button
      >
      <it-button
        type="danger"
        @click="deleteForm(formIdToDelete)"
        :loading="deletingForm"
        :disabled="deletingForm"
        >Delete</it-button
      >
    </template>
  </it-modal>
</template>

<script lang="ts" setup>
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
  NPopover,
  NSpin,
  NEmpty,
  NCard,
  // useMessage,
} from "naive-ui";
import Avatar from "vue-boring-avatars";
import type { Ref } from "vue";
import {
  UserIcon,
  FormsIcon,
  MenuIcon,
  EyeIcon,
  ArrowLeftIcon,
} from "vue-tabler-icons";
import { PB_KEY } from "~~/utils";
import type PocketBase from "pocketbase";
import { v4 as uuidv4, validate } from "uuid";
import { AccessType } from "~~/types";
// import { useSupabase } from "../store/supabase";
// import { Message } from "equal-vue";
// import ItDropdown from "@/node_modules/equal-vue/src/components/dropdown/ItDropdown.vue";
// import ItDropdownMenu from "@/node_modules/equal-vue/src/components/dropdown/ItDropdownMenu.vue";
// import ItDropdownItem from "@/node_modules/equal-vue/src/components/dropdown/ItDropdownItem.vue";

definePageMeta({
  middleware: "require-auth",
});

const { $message } = useNuxtApp();

const router = useRouter();
const pb = inject(PB_KEY) as PocketBase;

let isMobile: bool | undefined =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

const creatingForm = ref(false);

const page = ref(1);

const {
  pending,
  data: forms,
  refresh: refreshForms,
} = await useLazyAsyncData("forms", async () => {
  try {
    const f = await pb.collection("forms").getList(page.value, 9);
    return f.items;
  } catch (err) {
    throw new Error("could not complete request", { cause: err });
  }
});

watch(forms, (val) => {
  if (val instanceof Error) {
  }
  // loading.value = false;
});

// pb.collection("forms")
//   .getList(1, 9, {
//     // filter: "owner = @request.auth.id,",
//   })
//   .then((val) => {
//     console.log(val);
//     forms.value = val.items;
//     loading.value = false;
//   });

const createForm = () => {
  creatingForm.value = true;
  pb.collection("forms")
    .create({
      title: "New form",
      lastSaved: Date.now(),
      description: undefined,
      items: [],
      owner: pb.authStore.model?.id,
      accessFill: AccessType.PUBLIC,
      accessEdit: AccessType.PRIVATE,
    })
    .then((form) => router.push(`/edit/${form.id}?new=${form.title}`));
};

const showDeleteConfirmationModal = ref(false);
const formIdToDelete = ref("");
const formNameToDelete = ref("");
const deletingForm = ref(false);

const confirmDeleteForm = (formName: string, formId: string) => {
  formIdToDelete.value = formId;
  formNameToDelete.value = formName;
  showDeleteConfirmationModal.value = true;
};

const deleteForm = (id: string) => {
  deletingForm.value = true;
  pb.collection("forms")
    .delete(id)
    .then(() => {
      $message.success({ text: "Successfully deleted form", duration: 3000 });
      refreshForms();
    })
    .catch((e) => {
      $message.danger({ text: "Error when deleting form", duration: 3000 });
      refreshForms();
    })
    .finally(() => {
      deletingForm.value = false;
      showDeleteConfirmationModal.value = false;
    });
};

// onMounted(() => {
//   isMobile =
//     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//       navigator.userAgent
//     );
// });
// const supabase = useSupabase();
// (async () => {
//   let res = await supabase.supabase.auth.signUp({
//     email: "hipycas@gmail.com",
//     password: "niceone",
//   });
//   if (res.error) {
//     res = await supabase.supabase.auth.signIn({
//       email: "hipycas@gmail.com",
//       password: "niceone",
//     });
//   }
//   console.info(res);

// let it = await supabase.supabase
//   .from("forms")
//   .select("*")
//   .eq("user_id", res.user?.id);
// .eq("user_id", res.user?.id);
//   console.log(it);

//   //   loading.value = false;
//   forms.value = it.data;
// })();
</script>
