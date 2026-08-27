/**
 * Export file generators — no third-party spreadsheet/PDF dependencies.
 * - CSV: RFC4180-style UTF-8
 * - JSON: pretty-printed array of row objects
 * - XLSX: SpreadsheetML XML that Microsoft Excel opens (not OOXML zip)
 */

import type { ExportColumn } from "@/lib/validation/export";

/** Prefix cells that Excel/Sheets could treat as formulas. */
export function sanitizeSpreadsheetCell(value: string): string {
  if (value.length === 0) return value;
  const first = value.charAt(0);
  if (first === "=" || first === "+" || first === "-" || first === "@") {
    return `'${value}`;
  }
  return value;
}

export function cellToString(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  return String(value);
}

function escapeCsvField(raw: string): string {
  const safe = sanitizeSpreadsheetCell(raw);
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function buildCsv(
  columns: ExportColumn[],
  rows: Record<string, string>[]
): string {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvField(row[c.key] ?? "")).join(",")
  );
  // BOM helps Excel open UTF-8 correctly
  return `\uFEFF${[header, ...lines].join("\r\n")}`;
}

export function buildJson(
  columns: ExportColumn[],
  rows: Record<string, string>[]
): string {
  const objects = rows.map((row) => {
    const obj: Record<string, string> = {};
    for (const c of columns) {
      obj[c.label] = row[c.key] ?? "";
    }
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

/**
 * SpreadsheetML 2003 XML — opens in Excel without exceljs/xlsx packages.
 * File extension uses .xls with Excel-compatible content type.
 */
export function buildSpreadsheetMl(
  sheetName: string,
  columns: ExportColumn[],
  rows: Record<string, string>[]
): string {
  const escapeXml = (s: string) =>
    sanitizeSpreadsheetCell(s)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);

  const headerCells = columns
    .map(
      (c) =>
        `<Cell><Data ss:Type="String">${escapeXml(c.label)}</Data></Cell>`
    )
    .join("");

  const dataRows = rows
    .map((row) => {
      const cells = columns
        .map((c) => {
          const v = row[c.key] ?? "";
          const isNum = v !== "" && /^-?\d+(\.\d+)?$/.test(v);
          return `<Cell><Data ss:Type="${isNum ? "Number" : "String"}">${escapeXml(v)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  const safeSheet = sheetName.replace(/[^A-Za-z0-9 _-]/g, "").slice(0, 31) || "Export";

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${escapeXml(safeSheet)}">
  <Table>
   <Row>${headerCells}</Row>
   ${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function estimateUtf8Bytes(text: string): number {
  return Buffer.byteLength(text, "utf8");
}
