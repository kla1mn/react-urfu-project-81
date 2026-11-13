import Tag, { type TagAttributes } from "./Tag.js";

export type Template = Record<string, unknown>;

export type InputOptions = TagAttributes & {
  as?: "input" | "textarea";
};

const textareaDefaults = { cols: 20, rows: 40 };

export default class FormBuilder {
  readonly template: Template;

  readonly fields: Tag[] = [];

  constructor(template: Template) {
    this.template = template;
  }

  private getValue(name: string): string {
    if (!Object.hasOwn(this.template, name)) {
      throw new Error(`Field '${name}' does not exist in the template.`);
    }

    return String(this.template[name]);
  }

  input(name: string, options: InputOptions = {}): void {
    const { as, ...attributes } = options;
    const value = this.getValue(name);

    if (as === "textarea") {
      this.fields.push(new Tag("textarea", { ...textareaDefaults, ...attributes, name }, value));
      return;
    }

    this.fields.push(new Tag("input", { name, type: "text", value, ...attributes }));
  }
}
