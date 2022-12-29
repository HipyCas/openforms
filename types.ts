import { TablerIconComponent } from "vue-tabler-icons";
import { DefineComponent } from "vue";

// TODO Somehow bring back this idea
export interface AddButtonStates {
  [id: string]: {
    mouseOver: boolean;
    clicked: boolean;
  };
}

export interface Block {
  id: string;
  name: string;
  icon: TablerIconComponent;
  counter: number;
  component: DefineComponent<{}, {}, any>;
  options?: Record<string, BlockOption>;
}

export interface BlockOption {
  label: string;
  propName: string;
  type: BlockOptionType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  default?: any;
  autofocus?: boolean;
}

export type BlockOptionType =
  | "string"
  | "integer"
  | "decimal"
  | "boolean"
  | "select"
  | "multi-select";

export interface FormItem {
  id: string;
  title: string;
  description: string;
  type: string;
  data: FormItemData;
  options: Record<string, any>;
}

export type FormItemType = "text" | "input" | "code" | "markdown";

export type FormItemData = Record<string, any>;

export interface VueFormItem extends FormItem {
  editTitle: boolean;
  editDescription: boolean;
  blockOptions: Record<string, BlockOption>;
  blockComponent: DefineComponent<{}, {}, any>;
}

// export interface VueForm {
//   lastSaved: Date;
//   title: string;
//   description: string;
//   // TODO header_url: string;
//   items: VueFormItem[];
//   settings: FormSettings;
//   answers: FormAnswers;
// }

export interface Form extends BaseForm {
  id: string;
  created: Date;
  updated: Date;
}

export interface DBUpdateForm extends BaseForm {
  accessFill: AccessType;
  accessEdit: AccessType;
}

export interface BaseForm {
  title: string;
  lastSaved: Date;
  description: string;
  items: FormItem[];
}

export interface VueForm extends BaseForm {
  items: VueFormItem[];
  settings: FormSettings;
}

export interface FormSettings {
  access: {
    fill: AccessType;
    edit: AccessType;
  };
} // One answer per ip, require login, theme, etc...

export enum AccessType {
  PRIVATE = "private",
  LOGIN_ANYONE = "login-anyone",
  LOGIN_WHITELIST = "login-whitelist",
  LOGIN_BLACKLIST = "login-blacklist",
  VERIFIED_EMAIL = "verified-email",
  VERIFIED_NUMBER = "verified-number",
  PUBLIC = "public",
}

export type FormAnswers = FormAnswer[];
export interface FormAnswer {}
