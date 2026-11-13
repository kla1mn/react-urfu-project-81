import FormBuilder, { type Template } from "./FormBuilder.js";
import Tag from "./Tag.js";

export interface FormOptions {
  url?: string;
  method?: string;
}

export type FormCallback = (form: FormBuilder) => void;

export default class HexletCode {
  static formFor(template: Template, options: FormOptions, callback: FormCallback): string {
    const { url = "#", method = "post" } = options;
    const builder = new FormBuilder(template);

    callback(builder);

    return new Tag("form", { action: url, method }, builder.fields.join("")).toString();
  }
}
