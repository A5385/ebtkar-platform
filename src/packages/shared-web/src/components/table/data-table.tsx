'use client';

import {
    ColumnFiltersState,
    ColumnVisibilityState,
    PaginationState,
    RowSelectionState,
    SortingState,
    useTable,
    type ColumnDef,
    type RowData,
} from '@tanstack/react-table';
import { ReactNode } from 'react';
import { cn } from '../../lib';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { features, type DataTableFeatures } from './data-table-features';
import { DataTablePagination } from './data-table-pagination';
import DataTableSkeleton from './data-table-skeleton';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[];
    data: TData[] | undefined;
    isLoading: boolean;
    className?: string;
    filters?: ReactNode;
    sorting?: SortingState | undefined;
    setSorting?: React.Dispatch<React.SetStateAction<SortingState>> | undefined;
    columnFilters?: ColumnFiltersState | undefined;
    setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>> | undefined;
    columnVisibility?: ColumnVisibilityState | undefined;
    setColumnVisibility?: React.Dispatch<React.SetStateAction<ColumnVisibilityState>> | undefined;
    rowSelection?: RowSelectionState | undefined;
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>> | undefined;
    rowCount?: number | undefined;
    setPagination?: React.Dispatch<React.SetStateAction<PaginationState>> | undefined;
    pagination?:PaginationState|undefined
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    isLoading,
    className,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    filters,
    rowCount,
    setPagination,pagination
}: DataTableProps<TData>) {
    const table = useTable({
        features,
        data: data || [],
        columns,
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        rowCount,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    if (isLoading) return <DataTableSkeleton columns={columns} />;

    return (
        <div className={cn('', className)}>
            <div
                className={cn(
                    'flex items-center py-4',
                    filters ? 'justify-between' : 'justify-end',
                )}
            >
                {filters && filters}
                <DataTableViewOptions table={table} />
            </div>
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender header={header} />
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
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
