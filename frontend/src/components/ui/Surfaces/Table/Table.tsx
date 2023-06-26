"use client";

import {flexRender, getCoreRowModel, getFilteredRowModel, PaginationState, useReactTable,} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import {TextInput} from "@/components/ui/inputs/TextInput";
import {UserPagination} from "@/app/dashboard/view/users/(list)/page";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import {useUiStore} from "@/components/store/Store";
import {useSearchParams} from "next/navigation";

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
    const tableData = useUiStore((state) => state.tableData);
    const setTableData = useUiStore((state) => state.setTableData);
    const [loaded, setLoaded] = useState(false);
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
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
    const param = useSearchParams();
    const filterParam = param.get("filter")

    const table = useReactTable({
        data: tableData.length > 0 ? tableData : data,
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
        if (filterParam) {
            setGlobalFilter(filterParam);
        }
    }, [filterParam, setGlobalFilter]);


    useEffect(() => {
        if (!loaded && pageIndex === 0) {
            setLoaded(true);
            return;
        }
        if (!globalFilter) {
            getData(pageIndex + 1, pageSize, globalFilter).then((data) => {
                setTableData(data?.value?.users ?? data.users);
                setPageCount(data?.value?.totalPages ?? data.totalPages);
            });
        } else {
            if (globalFilterOld !== globalFilter) {
                setPagination({pageIndex: 0, pageSize: 10});
            }
            setGlobalFilterOld(globalFilter);
            getData(pageIndex + 1, pageSize, globalFilter).then((data) => {
                setPageCount(data?.value?.totalPages ?? data.totalPages);
                setTableData(data?.value?.users ?? data.users);
            });
        }
    }, [getData, globalFilter, pageIndex, pageSize, setTableData]);

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
