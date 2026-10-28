type ExportData = {
  responses: { id: string; createdAt: Date | string; respondentEmail?: string | null }[];
  answers: { responseId: string; fieldId: string; value: string }[];
};
type ExportField = { id?: string; label: string };

function cell(value: string): string {
  // Treat untrusted respondent text as text, including when opened in spreadsheet apps.
  const safe = /^[\s]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function buildResponsesCsv(data: ExportData, fields: ExportField[]): string {
  const answers = new Map(
    data.answers.map((answer) => [`${answer.responseId}:${answer.fieldId}`, answer.value]),
  );
  const rows = [
    ["Response ID", "Submitted at", "Email", ...fields.map((field) => field.label)],
    ...data.responses.map((response) => [
      response.id,
      new Date(response.createdAt).toISOString(),
      response.respondentEmail ?? "",
      ...fields.map((field) => answers.get(`${response.id}:${field.id}`) ?? ""),
    ]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
export function exportResponsesCsv(data: ExportData, fields: ExportField[]): void {
  const url = URL.createObjectURL(
    new Blob([buildResponsesCsv(data, fields)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `polliq-responses-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
