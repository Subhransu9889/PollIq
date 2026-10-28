import assert from "node:assert/strict";
import test from "node:test";
import { buildResponsesCsv } from "../response-export";

test("exports answers by stable field ID, preserves Unicode and escapes CSV", () => {
  const result = buildResponsesCsv(
    {
      responses: [{ id: "r1", createdAt: "2026-10-28T00:00:00Z", respondentEmail: null }],
      answers: [{ responseId: "r1", fieldId: "f2", value: 'Hello, "世界"\nNext line' }],
    },
    [
      { id: "f1", label: "Skipped" },
      { id: "f2", label: "Feedback" },
    ],
  );
  assert.ok(result.startsWith("\uFEFF"));
  assert.ok(result.includes('"2026-10-28T00:00:00.000Z","","","Hello, ""世界""\nNext line"'));
});

test("neutralizes spreadsheet formulas in user content and column labels", () => {
  const result = buildResponsesCsv(
    {
      responses: [{ id: "r1", createdAt: "2026-10-28T00:00:00Z", respondentEmail: "@SUM(1)" }],
      answers: [{ responseId: "r1", fieldId: "f1", value: " =SUM(1,2)" }],
    },
    [{ id: "f1", label: "+unsafe" }],
  );
  assert.ok(result.includes('"\'+unsafe"'));
  assert.ok(result.includes('"\'@SUM(1)"'));
  assert.ok(result.includes('"\' =SUM(1,2)"'));
});

test("exports headers for empty results without inventing responses", () => {
  const result = buildResponsesCsv({ responses: [], answers: [] }, [
    { id: "f1", label: "Feedback" },
  ]);
  assert.equal(result, '\uFEFF"Response ID","Submitted at","Email","Feedback"');
});
