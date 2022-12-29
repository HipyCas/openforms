import { InjectionKey } from "vue";
import { ConfigType, Dayjs } from "dayjs";
import hljs from "highlight.js";
import PocketBase from "pocketbase";

export type DAYJS_TYPE = (date?: ConfigType) => Dayjs;
export const DAYJS_KEY = Symbol("dayjs") as InjectionKey<DAYJS_TYPE>;

export const HLJS_KEY = Symbol("hljs") as InjectionKey<typeof hljs>;

export const PB_KEY = Symbol("pb") as InjectionKey<PocketBase>;
