import { useMemo } from 'react';
import { useReactTable, getCoreRowModel, type ColumnDef, flexRender } from '@tanstack/react-table';

type Props = { rows: any[]; columns: string[]; };

export default function DataGrid({ rows, columns }: Props) {
  const cols = useMemo<ColumnDef<any>[]>(() =>
    columns.map((key) => ({ accessorKey: key, header: key })), [columns]);

  const table = useReactTable({ data: rows, columns: cols, getCoreRowModel: getCoreRowModel() });

  if (!rows?.length) return <p style={{ color: '#6b7280' }}>Sem dados.</p>;

  return (
    <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(r => (
            <tr key={r.id}>
              {r.getVisibleCells().map(c => (
                <td key={c.id} style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
