import type { Form, Input, InputType } from "./FormBuilder.js";
import Tag from "./Tag.js";

type Renderers = {
  [T in InputType]: (input: Input<T>) => Tag[];
};

const renderLabel = (name: string, label: string): Tag => new Tag("label", { for: name }, label);

// HTML для каждого типа input: новый тип — новая запись в этом объекте
const renderers: Renderers = {
  text: ({ name, label, value, attributes }) => [
    renderLabel(name, label),
    new Tag("input", { name, type: "text", value, ...attributes }),
  ],
  textarea: ({ name, label, value, attributes }) => [
    renderLabel(name, label),
    new Tag("textarea", { cols: 20, rows: 40, ...attributes, name }, value),
  ],
  submit: ({ value }) => [new Tag("input", { type: "submit", value })],
};

const renderInput = <T extends InputType>(input: Input<T>): Tag[] => renderers[input.type](input);

const renderHtml = ({ attributes, inputs }: Form): string => {
  const body = inputs.flatMap((input) => renderInput(input)).join("");

  return new Tag("form", attributes, body).toString();
};

export default renderHtml;
