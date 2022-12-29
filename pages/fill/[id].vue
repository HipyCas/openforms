<template>
  <n-page-header class="p-4">
    <!--template #back>
      <router-link to="/">
        <n-icon><ArrowLeftIcon></ArrowLeftIcon> </n-icon>
      </router-link>
    </!--template-->
    <template #title>
      <span>{{ formStore.title }}</span>
    </template>
    <template #subtitle>
      <span>Last updated {{ formStore.lastSaved }}</span>
    </template>
    <template #avatar>
      <n-avatar class="bg-indigo-600">
        <n-icon>
          <FormsIcon />
        </n-icon>
      </n-avatar>
    </template>
    <template #extra>
      <n-space>
        <NuxtLink to="/">
          <n-button icon-placement="right">
            Create one
            <template #icon>
              <n-icon>
                <ExternalLinkIcon></ExternalLinkIcon>
              </n-icon>
            </template>
          </n-button>
        </NuxtLink>
        <!--ClientOnly>
          <n-dropdown :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px"> ··· </n-button>
          </n-dropdown>
        </!--ClientOnly-->
      </n-space>
    </template>

    <main>
      <n-card v-for="(item, index) in formStore.items">
        <template #header>
          <span>{{ item.title }}</span>
        </template>
      </n-card>
    </main>
  </n-page-header>
</template>

<script setup lang="ts">
// import type { Form } from "~~/types";

// const { form } = defineProps<{
//   form: Form;
// }>();
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
  NCard,
  useMessage,
} from "naive-ui";
import {
  UserIcon,
  FormsIcon,
  MenuIcon,
  EyeIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
} from "vue-tabler-icons";

import { useFormStore } from "~~/store";
import type pocketbaseEs from "pocketbase";

const pb = inject(PB_KEY) as pocketbaseEs;

const route = useRoute();
const formStore = useFormStore();

onMounted(() => {
  formStore.fromLocalStorage(pb, route.params.id as string);
});
</script>
