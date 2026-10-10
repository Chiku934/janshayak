import React from 'react';
import { cn } from '../../utils/cn';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search filters or check back later.',
  className,
}: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className="my-4" />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs', className)}>
      <table className="w-full min-w-[650px] text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className={cn('px-4 py-3.5 whitespace-nowrap', col.headerClassName)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {data.map((row, rowIdx) => (
            <tr
              key={row.id ? String(row.id) : rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={cn(
                'transition-colors',
                onRowClick ? 'hover:bg-blue-50/40 cursor-pointer' : 'hover:bg-slate-50/60'
              )}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={cn('px-4 py-3.5', col.className)}>
                  {col.cell
                    ? col.cell(row)
                    : col.accessorKey
                    ? String(row[col.accessorKey] ?? '')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
