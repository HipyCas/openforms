import { Block } from "./types";
import {
  BoxMultipleIcon,
  AlignLeftIcon,
  MarkdownIcon,
  CodeIcon,
  PaletteIcon,
} from "vue-tabler-icons";
import GroupVue from "./components/blocks/Group.vue";
import TextVue from "./components/blocks/Group.vue";
import MarkdownVue from "./components/blocks/Group.vue";
import CodeVue from "./components/blocks/Code.vue";
import ColorVue from "./components/blocks/Color.vue";

export default [
  {
    id: "group",
    name: "Group",
    icon: BoxMultipleIcon,
    component: GroupVue,
    counter: 0,
  },
  {
    id: "text",
    name: "Text",
    icon: AlignLeftIcon,
    component: TextVue,
    counter: 0,
  },
  {
    id: "markdown",
    name: "Markdown",
    icon: MarkdownIcon,
    component: MarkdownVue,
    counter: 0,
  },
  {
    id: "code",
    name: "Code",
    icon: CodeIcon,
    component: CodeVue,
    options: {
      language: {
        label: "Language",
        // required: true,
        type: "string",
      },
    },
    data: {
      code: "",
    },
    counter: 0,
  },
  {
    id: "color",
    name: "Color",
    icon: PaletteIcon,
    component: ColorVue,
    options: {
      showAlpha: {
        label: "Show Alpha",
        required: true,
        default: true,
        type: "boolean",
      },
      showPreview: {
        label: "Show Preview",
        required: true,
        default: true,
        type: "boolean",
      },
    },
    counter: 0,
  },
] as Block[];
