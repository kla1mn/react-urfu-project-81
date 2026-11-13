import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import HexletCode, { type FormOptions, type InputOptions } from "../src/index.js";

// Фикстуры отформатированы для читаемости, генератор выдаёт HTML в одну строку
const readFixture = (name: string): string =>
  readFileSync(path.join(import.meta.dirname, "..", "__fixtures__", name), "utf-8")
    .replace(/>\s+</g, "><")
    .trim();

describe("HexletCode.formFor", () => {
  const template = { name: "rob", job: "hexlet", gender: "m" };

  test.each<{ options: FormOptions; expected: string }>([
    { options: {}, expected: '<form method="post" action="#"></form>' },
    { options: { url: "/users" }, expected: '<form method="post" action="/users"></form>' },
    {
      options: { url: "/users", method: "get" },
      expected: '<form method="get" action="/users"></form>',
    },
  ])("generates empty form with options $options", ({ options, expected }) => {
    expect(HexletCode.formFor(template, options, () => {})).toBe(expected);
  });

  test("generates form with labeled fields and submit", () => {
    const form = HexletCode.formFor(template, { method: "post" }, (f) => {
      f.input("name");
      f.input("job", { as: "textarea" });
      f.submit();
    });

    expect(form).toBe(readFixture("full-form.html"));
  });

  test("adds extra attributes to fields", () => {
    const form = HexletCode.formFor(template, {}, (f) => {
      f.input("name", { class: "user-input" });
      f.input("job");
    });

    expect(form).toBe(readFixture("input-with-attributes.html"));
  });

  test("uses label text and attributes from options", () => {
    const form = HexletCode.formFor(template, {}, (f) => {
      f.input("name", { label: "User", labelHtml: { class: "form-label", id: "name-label" } });
      f.submit("Ok");
    });

    expect(form).toBe(readFixture("label-attributes.html"));
  });

  test.each<{ options: InputOptions; fixture: string }>([
    { options: { as: "textarea" }, fixture: "textarea-default.html" },
    { options: { as: "textarea", rows: 50, cols: 50 }, fixture: "textarea-custom-size.html" },
  ])("generates textarea with options $options", ({ options, fixture }) => {
    const form = HexletCode.formFor(template, {}, (f) => f.input("job", options));

    expect(form).toBe(readFixture(fixture));
  });

  test.each([
    { text: undefined, expected: "Save" },
    { text: "Wow", expected: "Wow" },
  ])("generates submit with text $text", ({ text, expected }) => {
    const form = HexletCode.formFor(template, {}, (f) => f.submit(text));

    expect(form).toBe(
      `<form method="post" action="#"><input type="submit" value="${expected}"></form>`,
    );
  });

  test("throws when field does not exist in template", () => {
    expect(() =>
      HexletCode.formFor(template, { url: "/users" }, (f) => {
        f.input("name");
        f.input("job", { as: "textarea" });
        f.input("age");
      }),
    ).toThrow(new Error("Field 'age' does not exist in the template."));
  });
});
