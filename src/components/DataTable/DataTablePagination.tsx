import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export const DataTablePagination = ({ table }: { table: Table<any> }) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <div className="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} de{' '}
      {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
    </div>
    <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Próximo
      </Button>
    </div>
  </div>
);
