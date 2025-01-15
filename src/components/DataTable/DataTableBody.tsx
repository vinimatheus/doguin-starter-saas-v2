import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead
} from '@/components/ui/table';
import {
  flexRender,
  Row,
  HeaderGroup,
  Table as ReactTableType
} from '@tanstack/react-table';

type DataTableBodyProps<TData> = {
  table: ReactTableType<TData>;
};

export const DataTableBody = <TData,>({ table }: DataTableBodyProps<TData>) => (
  <Table>
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: Row<TData>) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            Sem resultados.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);
