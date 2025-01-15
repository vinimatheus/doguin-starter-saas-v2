import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export const DataTableHeader = ({ table }: { table: Table<any> }) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filtrar emails..."
        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('email')?.setFilterValue(e.target.value)
        }
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Colunas <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
