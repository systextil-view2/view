import * as XLSX from 'xlsx';
import type { QueryResponse } from '../types';

export function exportToXlsx(resp: QueryResponse, fileBase: string) {
  const ws = XLSX.utils.json_to_sheet(resp.rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  XLSX.writeFile(wb, `${fileBase || 'relatorio'}.xlsx`);
}
