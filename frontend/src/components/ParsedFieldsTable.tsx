'use client';

import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

export interface FieldData {
  tag: string;
  path: string;
  value: string;
  dataType: string;
}

const columnHelper = createColumnHelper<FieldData>();

const columns = [
  columnHelper.accessor('tag', {
    header: 'Tag',
    cell: info => <span className="font-mono font-semibold text-[var(--accent-cyan)]">{info.getValue()}</span>,
  }),
  columnHelper.accessor('path', {
    header: 'Path',
    cell: info => <span className="text-[var(--text-tertiary)] font-mono max-w-[260px] truncate block">{info.getValue()}</span>,
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    cell: info => <span className="font-mono text-[var(--success)]">{info.getValue()}</span>,
  }),
  columnHelper.accessor('dataType', {
    header: 'Data Type',
    cell: info => <span className="badge badge-indigo text-[10px]">{info.getValue()}</span>,
  }),
];

export default function ParsedFieldsTable({ data }: { data: FieldData[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-[var(--border-slate)] rounded-lg overflow-hidden bg-[rgba(3,7,18,0.4)]">
      <table className="w-full text-xs text-left">
        <thead className="bg-[var(--surface-navy)] border-b border-[var(--border-slate)]">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-3 font-semibold text-[var(--text-tertiary)] uppercase tracking-wider text-[11px]">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[var(--border-slate)]">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-[rgba(56,189,248,0.04)] transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
