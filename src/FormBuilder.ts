import type { TagAttributes } from "./Tag.js";

export type Template = Record<string, unknown>;

export type InputOptions = TagAttributes & {
  as?: "input" | "textarea";
};

// Внутренняя структура формы не зависит от способа отображения:
// HTML строит отдельный рендерер, их может быть несколько
export interface FieldElement {
  type: "input" | "textarea";
  name: string;
  label: string;
  value: string;
  attributes: TagAttributes;
}

export interface SubmitElement {
  type: "submit";
  value: string;
}

export type FormElement = FieldElement | SubmitElement;

const capitalize = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export default class FormBuilder {
  readonly template: Template;

  readonly elements: FormElement[] = [];

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
    const { as = "input", ...attributes } = options;

    this.elements.push({
      type: as,
      name,
      label: capitalize(name),
      value: this.getValue(name),
      attributes,
    });
  }

  submit(value = "Save"): void {
    this.elements.push({ type: "submit", value });
  }
}
