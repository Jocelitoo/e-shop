'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CurrentUserProps } from '@/utils/props';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  currentUser: CurrentUserProps | null;
}

export const DataTable = <TData, TValue>({
  columns,
  currentUser,
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [data, setData] = useState<TData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const getData = () => {
    axios
      .get('/api/order')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        toast({
          description: error.response.data.message,
          style: { backgroundColor: '#dd1212', color: '#fff' },
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // Redirecionar o usuário deslogado ou o usuário que n é ADMIN para a Home
    if (!currentUser || currentUser.role !== 'ADMIN') {
      router.push('/'); // Redireciona para a Home
      router.refresh(); // Recarrega a página atual
    }

    // Pegar os dados da base de dados
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Pegar automaticamente os dados da base de dados a cada 10 minutos
  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
    }, 600000); // 600 seconds (10min)

    return () => clearInterval(intervalId); // Clean up the interval on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
    initialState: {
      sorting: [
        {
          id: 'createdDate',
          desc: true, // Item de id 'createdDate' vai ser classificado do último dado criado na base de dados (mais recente) até o primeiro (mais antigo)
        },
      ],
    },
  });

  return (
    <Container>
      <h1 className="mt-16 mb-8 text-center text-2xl font-bold">
        Gerencie os pedidos
      </h1>

      <div>
        <div className="rounded-md border">
          {currentUser?.role === 'ADMIN' && (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      {isLoading ? (
                        <span className="flex gap-2 items-center justify-center">
                          <Loader2 className="animate-spin" /> Carregando
                          pedidos...
                        </span>
                      ) : (
                        <span className="flex gap-2 items-center justify-center">
                          Sem resultados
                        </span>
                      )}
                    </TableCell>

                    {/* <TableCell colSpan={columns.length}>
                      <span className="flex gap-2 items-center justify-center">
                        Sem resultados
                      </span>
                    </TableCell> */}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p>N° de pedidos: {data.length} </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-2">
              <p>Linhas por página:</p>

              <select
                className="cursor-pointer"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft />
              </Button>

              <input
                type="number"
                onChange={(event) =>
                  table.setPageIndex(Number(event.target.value) - 1)
                }
                placeholder={`${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
                className="max-w-16 text-center"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Proximo</span>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
