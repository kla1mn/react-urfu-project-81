export type AttributeValue = string | number;

export type TagAttributes = Record<string, AttributeValue>;

const singleTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

export default class Tag {
  readonly name: string;

  readonly attributes: TagAttributes;

  readonly body: string;

  constructor(name: string, attributes: TagAttributes = {}, body = "") {
    this.name = name;
    this.attributes = attributes;
    this.body = body;
  }

  isSingle(): boolean {
    return singleTags.has(this.name);
  }

  private buildAttributes(): string {
    return Object.entries(this.attributes)
      .map(([key, value]) => ` ${key}="${value}"`)
      .join("");
  }

  toString(): string {
    const openingTag = `<${this.name}${this.buildAttributes()}>`;

    if (this.isSingle()) {
      return openingTag;
    }

    return `${openingTag}${this.body}</${this.name}>`;
  }
}
