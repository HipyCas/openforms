import { defineStore } from "pinia";
import { VueForm, Form, Block, AccessType } from "../types";
import blocks from "../blocks";
import type PocketBase from "pocketbase";

const dbg = (p: any, msg?: string) => {
  console.log("dbg >", msg ?? "", p);
  return p;
};

export const useFormStore = defineStore("form", {
  // state: (): VueForm => ({
  state: (): VueForm => ({
    lastSaved: new Date(),
    title: "New form",
    description: "",
    items: [],
    settings: {
      access: {
        fill: AccessType.PRIVATE,
        edit: AccessType.PRIVATE,
      },
    },
  }),
  actions: {
    async fromLocalStorage(pb: PocketBase, formId: string) {
      let dbForm: Form | undefined = undefined;
      let localStorageForm: VueForm | undefined = undefined;
      let form: VueForm | Form | undefined;

      console.log("STORE.fromLocalStorage > trying to load from db");
      try {
        dbForm = await pb.collection("forms").getOne(formId);
        console.log("STORE.fromLocalStorage > loaded from DB", dbForm);
      } catch (e) {
        console.warn("error when requesting form", e);
      }

      if (dbForm === undefined) {
        console.log(
          "STORE.fromLocalStorage > no form from db, loading from localStorage"
        );
        const localStorageFormString = dbg(
          localStorage.getItem(`OpenFormsSave.${formId}`),
          "localStorageFormString"
        );

        if (localStorageFormString === null) {
          console.warn("No form saved in local storage");
          return;
        }

        localStorageForm = dbg(
          JSON.parse(localStorageFormString),
          "localStorageForm"
        );
      }

      form = dbForm === undefined ? localStorageForm : dbForm;
      console.log("STORE.fromLocalStorage > form is following:", form);

      form["items"] = dbg(
        form["items"].map((item) => {
          console.log("STORE.fromLocalStorage > mapping form items", item);
          const block: Block | undefined = blocks.find(
            (b) => b.id === item.type
          );
          if (block === undefined) {
            console.error("Unknown block type");
            return;
          }
          // TODO When properly implementing form saving/loading, make proper error handling
          item["editTitle"] = false;
          item["editDescription"] = false;
          item["blockComponent"] = block.component;
          item["blockOptions"] = block.options || {};
          return item;
        })
      );

      this.$state = form;
      console.log(
        "STORE.fromLocalStorage > updated state to form",
        this.$state
      );
    },
  },
});
