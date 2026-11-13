import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import HexletCode, { type FormCallback } from "../src/index.js";
import FormBuilder from "../src/FormBuilder.js";

// Фикстуры отформатированы для читаемости, генератор выдаёт HTML в одну строку
const readFixture = (name: string): string =>
  readFileSync(path.join(import.meta.dirname, "..", "__fixtures__", name), "utf-8")
    .replace(/>\s+</g, "><")
    .trim();

describe("HexletCode.formFor", () => {
  const template = { name: "rob", job: "hexlet", gender: "m" };

  describe("empty form", () => {
    test("generates form with default action and method", () => {
      const form = HexletCode.formFor(template, {}, () => {});

      expect(form).toBe('<form action="#" method="post"></form>');
    });

    test("uses url as form action", () => {
      const form = HexletCode.formFor(template, { url: "/users" }, () => {});

      expect(form).toBe('<form action="/users" method="post"></form>');
    });

    test("uses passed method", () => {
      const form = HexletCode.formFor(template, { method: "get", url: "/users" }, () => {});

      expect(form).toBe('<form action="/users" method="get"></form>');
    });

    test("calls the callback once with a form builder", () => {
      const callback = vi.fn<FormCallback>();

      HexletCode.formFor(template, {}, callback);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mock.calls[0]?.[0]).toBeInstanceOf(FormBuilder);
    });
  });

  describe("fields", () => {
    test("generates input and textarea", () => {
      const form = HexletCode.formFor(template, { method: "post" }, (f) => {
        f.input("name");
        f.input("job", { as: "textarea" });
      });

      expect(form).toBe(readFixture("input-and-textarea.html"));
    });

    test("adds extra attributes to fields", () => {
      const form = HexletCode.formFor(template, {}, (f) => {
        f.input("name", { class: "user-input" });
        f.input("job");
      });

      expect(form).toBe(readFixture("input-with-attributes.html"));
    });

    test("uses default textarea size", () => {
      const form = HexletCode.formFor(template, {}, (f) => f.input("job", { as: "textarea" }));

      expect(form).toBe(readFixture("textarea-default.html"));
    });

    test("overrides default textarea size", () => {
      const form = HexletCode.formFor(template, { url: "#" }, (f) =>
        f.input("job", { as: "textarea", rows: 50, cols: 50 }),
      );

      expect(form).toBe(readFixture("textarea-custom-size.html"));
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
});
