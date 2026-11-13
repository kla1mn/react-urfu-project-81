import type { TagAttributes } from "./Tag.js";

export type Template = Record<string, unknown>;

interface FieldData {
  name: string;
  label: string;
  value: string;
  attributes: TagAttributes;
}

interface SubmitData {
  value: string;
}

// Данные каждого типа input. Новый тип добавляется одной строкой
export interface InputTypes {
  text: FieldData;
  textarea: FieldData;
  submit: SubmitData;
}

export type InputType = keyof InputTypes;

export type Input<T extends InputType = InputType> = {
  [K in T]: { type: K } & InputTypes[K];
}[T];

// Внутреннее представление формы не зависит от способа отображения
export interface Form {
  attributes: TagAttributes;
  inputs: readonly Input[];
}

export type InputOptions = TagAttributes & {
  as?: "text" | "textarea";
};

const capitalize = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

export default class FormBuilder {
  private readonly template: Template;

  private readonly attributes: TagAttributes;

  private inputs: readonly Input[] = [];

  constructor(template: Template, attributes: TagAttributes) {
    this.template = template;
    this.attributes = attributes;
  }

  private getValue(name: string): string {
    if (!Object.hasOwn(this.template, name)) {
      throw new Error(`Field '${name}' does not exist in the template.`);
    }

    return String(this.template[name]);
  }

  private addInput(input: Input): void {
    this.inputs = [...this.inputs, input];
  }

  input(name: string, options: InputOptions = {}): void {
    const { as = "text", ...attributes } = options;

    this.addInput({
      type: as,
      name,
      label: capitalize(name),
      value: this.getValue(name),
      attributes,
    });
  }

  submit(value = "Save"): void {
    this.addInput({ type: "submit", value });
  }

  getForm(): Form {
    return { attributes: this.attributes, inputs: this.inputs };
  }
}
