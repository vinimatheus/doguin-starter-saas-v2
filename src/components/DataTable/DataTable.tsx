'use client';
import * as React from 'react';
import { useDataTable, type UserData } from './useDataTable';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { DataTablePagination } from './DataTablePagination';

type DataTableProps = {
  data: UserData[];
};

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const table = useDataTable(data);

  return (
    <div className="w-full">
      <DataTableHeader table={table} />
      <div className="rounded-md border">
        <DataTableBody table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
