import { describe, expect, test } from "vitest";
import Tag, { type TagAttributes } from "../src/Tag.js";

interface TagCase {
  name: string;
  attributes: TagAttributes;
  body?: string;
  expected: string;
}

describe("Tag", () => {
  describe("single tags", () => {
    test.each<TagCase>([
      { name: "br", attributes: {}, expected: "<br>" },
      { name: "img", attributes: { src: "path/to/image" }, expected: '<img src="path/to/image">' },
      {
        name: "input",
        attributes: { type: "submit", value: "Save" },
        expected: '<input type="submit" value="Save">',
      },
    ])("<$name> with $attributes", ({ name, attributes, expected }) => {
      const tag = new Tag(name, attributes);

      expect(tag.isSingle()).toBe(true);
      expect(tag.toString()).toBe(expected);
    });

    test("ignores body", () => {
      expect(new Tag("br", {}, "text").toString()).toBe("<br>");
    });
  });

  describe("paired tags", () => {
    test.each<TagCase>([
      { name: "div", attributes: {}, body: undefined, expected: "<div></div>" },
      { name: "label", attributes: {}, body: "Email", expected: "<label>Email</label>" },
      {
        name: "label",
        attributes: { for: "email" },
        body: "Email",
        expected: '<label for="email">Email</label>',
      },
    ])("<$name> with $attributes and body $body", ({ name, attributes, body, expected }) => {
      const tag = new Tag(name, attributes, body);

      expect(tag.isSingle()).toBe(false);
      expect(tag.toString()).toBe(expected);
    });
  });

  test("uses empty attributes by default", () => {
    expect(new Tag("div").attributes).toEqual({});
  });

  test("renders numeric attribute values", () => {
    expect(new Tag("textarea", { cols: 20, rows: 40 }).toString()).toBe(
      '<textarea cols="20" rows="40"></textarea>',
    );
  });

  test("keeps attribute order", () => {
    expect(new Tag("input", { value: "rob", name: "name" }).toString()).toBe(
      '<input value="rob" name="name">',
    );
  });

  test("works with template literals", () => {
    expect(`${new Tag("hr")}`).toBe("<hr>");
  });
});
