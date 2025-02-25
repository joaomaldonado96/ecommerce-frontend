import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToExcel(data: any[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToPDF(data: any[], columns: string[], filename: string) {
  const doc = new jsPDF();
  doc.text(filename, 14, 10);
  
  autoTable(doc, {
    head: [columns],
    body: data.map((row) => columns.map((col) => row[col])),
  });

  doc.save(`${filename}.pdf`);
}
