import type { FieldElement, FormElement } from "./FormBuilder.js";
import Tag, { type TagAttributes } from "./Tag.js";

const textareaDefaults = { cols: 20, rows: 40 };

const renderField = ({ type, name, value, attributes }: FieldElement): Tag => {
  if (type === "textarea") {
    return new Tag("textarea", { ...textareaDefaults, ...attributes, name }, value);
  }

  return new Tag("input", { name, type: "text", value, ...attributes });
};

const renderElement = (element: FormElement): Tag[] => {
  if (element.type === "submit") {
    return [new Tag("input", { type: "submit", value: element.value })];
  }

  return [new Tag("label", { for: element.name }, element.label), renderField(element)];
};

const renderHtml = (attributes: TagAttributes, elements: FormElement[]): string => {
  const body = elements.flatMap(renderElement).join("");

  return new Tag("form", attributes, body).toString();
};

export default renderHtml;
