import assert from "node:assert/strict";
import test from "node:test";
import type { AnswerValueType } from "../model";
import { validateAnswers } from "../validation";

const text = { id: "text", label: "Name", type: "TEXT", required: true };
test("requires nonblank answers and rejects cross-form and duplicate IDs", () => {
  assert.throws(() => validateAnswers([text], []), /Please answer/);
  assert.throws(() => validateAnswers([text], [{ fieldId: "text", value: "  " }]), /Please answer/);
  assert.throws(() => validateAnswers([text], [{ fieldId: "other", value: "Alice" }]), /belong/);
  assert.throws(
    () =>
      validateAnswers(
        [text],
        [
          { fieldId: "text", value: "Alice" },
          { fieldId: "text", value: "Bob" },
        ],
      ),
    /Duplicate/,
  );
});
test("requires checked consent while preserving optional false and zero", () => {
  const consent = { ...text, type: "CHECKBOX" };
  assert.throws(() => validateAnswers([consent], [{ fieldId: "text", value: false }]), /Invalid/);
  assert.equal(
    validateAnswers([{ ...consent, required: false }], [{ fieldId: "text", value: false }])[0]
      ?.value,
    false,
  );
  assert.equal(
    validateAnswers([{ ...text, type: "NUMBER" }], [{ fieldId: "text", value: 0 }])[0]?.value,
    0,
  );
});
test("validates selections, numbers, email, date, and URL", () => {
  for (const [type, value, config] of [
    ["SELECT", "unknown", { options: [{ label: "Yes", value: "yes" }] }],
    ["MULTI_SELECT", ["yes", "yes"], { options: [{ label: "Yes", value: "yes" }] }],
    ["NUMBER", 11, { max: 10 }],
    ["NUMBER", 1.5, { step: 1 }],
    ["EMAIL", "invalid", {}],
    ["DATE", "2026-02-30", {}],
    ["TEXT", "javascript:alert(1)", { pattern: "url" }],
  ] as Array<[string, AnswerValueType, unknown]>) {
    assert.throws(
      () => validateAnswers([{ ...text, type, config }], [{ fieldId: "text", value: value }]),
      /Invalid/,
    );
  }
});
test("requires only visible conditional fields and discards hidden answers", () => {
  const fields = [
    { ...text, required: false },
    {
      id: "conditional",
      label: "Details",
      type: "TEXT",
      required: true,
      config: { condition: { fieldOrder: 0, equals: "yes" } },
    },
    {
      id: "nested",
      label: "More",
      type: "TEXT",
      required: true,
      config: { condition: { fieldOrder: 1, equals: "yes" } },
    },
  ];
  assert.deepEqual(validateAnswers(fields, [{ fieldId: "conditional", value: "yes" }]), []);
  assert.throws(() => validateAnswers(fields, [{ fieldId: "text", value: "yes" }]), /Details/);
  assert.equal(validateAnswers(fields, [{ fieldId: "text", value: "no" }]).length, 1);
});
