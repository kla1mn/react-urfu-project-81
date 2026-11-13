import FormBuilder, { type Template } from "./FormBuilder.js";
import renderHtml from "./renderHtml.js";

export interface FormOptions {
  url?: string;
  method?: string;
}

export type FormCallback = (form: FormBuilder) => void;

export default class HexletCode {
  static formFor(template: Template, options: FormOptions, callback: FormCallback): string {
    const { url = "#", method = "post" } = options;
    const builder = new FormBuilder(template, { method, action: url });

    callback(builder);

    return renderHtml(builder.getForm());
  }
}
