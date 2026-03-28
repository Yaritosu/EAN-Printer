import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const sourceUrl = "https://elvent.shop/api/ai/products/all";
const outputDir = path.resolve("C:/root/EAN-Printer/data");
const csvPath = path.join(outputDir, "elvent-products.csv");
const xlsxPath = path.join(outputDir, "elvent-products.xlsx");

const normalizeEan = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const digits = String(value).replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return digits.padStart(13, "0");
};

const normalizeRow = (item) => ({
  name: item.name ?? "",
  sku: item.sku ?? "",
  ean: normalizeEan(item.ean),
  slug: item.slug ?? "",
  available: item.available ? "true" : "false",
  shopUrl: item.shopUrl ?? ""
});

const quoteCsv = (value) => {
  const text = String(value ?? "");
  if (!/[",\n;]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const response = await fetch(sourceUrl, {
  headers: {
    accept: "application/json"
  }
});

if (!response.ok) {
  throw new Error(`Elvent API request failed with ${response.status}`);
}

const payload = await response.json();
const items = Array.isArray(payload.items) ? payload.items : [];
const rows = items.map(normalizeRow);

const header = ["name", "sku", "ean", "slug", "available", "shopUrl"];
const csvLines = [header.join(";"), ...rows.map((row) => header.map((key) => quoteCsv(row[key])).join(";"))];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\n")}`, "utf8");

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(rows);
xlsx.utils.book_append_sheet(workbook, worksheet, "ElventProducts");
xlsx.writeFile(workbook, xlsxPath);

console.log(JSON.stringify({
  sourceUrl,
  generatedAt: payload.generatedAt ?? null,
  totalCount: payload.totalCount ?? rows.length,
  csvPath,
  xlsxPath
}, null, 2));
