import type { AttributeValue, TagAttributes } from "./Tag.js";

export type Template = Record<string, unknown>;

export interface Label {
  text: string;
  attributes: TagAttributes;
}

interface FieldData {
  name: string;
  label: Label;
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

export interface InputOptions {
  // Тип поля, сам атрибутом не становится
  as?: "text" | "textarea";
  // Текст и атрибуты тега label
  label?: string;
  labelHtml?: TagAttributes;
  // Остальные опции — атрибуты поля
  [attribute: string]: AttributeValue | TagAttributes | undefined;
}

const capitalize = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

const isAttribute = (entry: [string, unknown]): entry is [string, AttributeValue] =>
  typeof entry[1] === "string" || typeof entry[1] === "number";

const pickAttributes = (options: Record<string, unknown>): TagAttributes =>
  Object.fromEntries(Object.entries(options).filter(isAttribute));

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
    const { as = "text", label = capitalize(name), labelHtml = {}, ...attributes } = options;

    this.addInput({
      type: as,
      name,
      label: { text: label, attributes: labelHtml },
      value: this.getValue(name),
      attributes: pickAttributes(attributes),
    });
  }

  submit(value = "Save"): void {
    this.addInput({ type: "submit", value });
  }

  getForm(): Form {
    return { attributes: this.attributes, inputs: this.inputs };
  }
}
