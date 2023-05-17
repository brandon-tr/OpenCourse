"use client";

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { UserPagination } from "@/app/dashboard/view/users/(list)/page";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import useWindowSize from "@/components/hooks/UseWindowSize";

interface TableProps<T extends object> {
  data: T[];
  columns: any[];
  alternatingColors?: boolean;
  paginationData: UserPagination;
  getData: (
    pageNumber: number,
    pageSize: number,
    search: string
  ) => Promise<any>;
}

const Table = <T extends object>({
  data,
  columns,
  alternatingColors = true,
  paginationData,
  getData,
}: TableProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalFilterOld, setGlobalFilterOld] = useState("");
  const [tableData, setTableData] = useState(data);
  const [loaded, setLoaded] = useState(false);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(paginationData.totalPages);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter,
      pagination,
    },
    pageCount: pageCount,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  useEffect(() => {
    if (!loaded && pageIndex === 0) {
      setLoaded(true);
      return;
    }
    if (!globalFilter) {
      getData(pageIndex + 1, pageSize, globalFilter).then((data) => {
        setTableData(data.value.users);
        setPageCount(data.value.totalPages);
      });
    } else {
      if (globalFilterOld !== globalFilter) {
        setPagination({ pageIndex: 0, pageSize: 10 });
      }
      setGlobalFilterOld(globalFilter);
      getData(pageIndex + 1, pageSize, globalFilter).then((data) => {
        console.log(data);
        setPageCount(data.value.totalPages);
        setTableData(data.value.users);
      });
    }
  }, [getData, globalFilter, pageIndex, pageSize]);

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className="flex items-start mb-4">
        <TextInput
          label={"Filter"}
          value={globalFilter}
          onChange={setGlobalFilter}
          debounced={true}
        />
      </div>
      <table className="w-full text-center">
        <thead className="border-b bg-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-sm font-medium text-gray-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b ${
                alternatingColors
                  ? i % 2 === 0
                    ? "bg-gray-200"
                    : "bg-white"
                  : "bg-white"
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className="whitespace-nowrap px-6 py-4 text-sm font-light text-gray-900"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="md:sticky md:-left-0 flex justify-end items-end w-full mt-2 gap-2">
        <MaterialButton
          size={"small"}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </MaterialButton>
        <MaterialButton
          size={"small"}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </MaterialButton>
        <MaterialButton
          size={"small"}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </MaterialButton>
        <MaterialButton
          size={"small"}
          onClick={() => {
            table.setPageIndex(table.getPageCount() - 1);
          }}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </MaterialButton>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default Table;
