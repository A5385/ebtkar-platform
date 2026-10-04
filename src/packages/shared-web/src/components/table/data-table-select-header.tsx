import { ColumnHelper, RowData } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { DataTableFeatures } from './data-table-features';

export type DataTableSelectProps<TData extends RowData> = {
    display: ColumnHelper<DataTableFeatures, TData>['display'];
};
export const DataTableSelect = <TData extends RowData>({
    display,
}: DataTableSelectProps<TData>) => {
    return display({
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={
                    table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    });
};
