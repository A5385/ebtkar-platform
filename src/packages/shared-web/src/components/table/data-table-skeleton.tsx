import { ColumnDef, RowData } from '@tanstack/react-table';
import { Skeleton } from '../ui/skeleton';
import { DataTableFeatures } from './data-table-features';

type DataTableSkeletonProps<TData extends RowData> = {
    columns: ColumnDef<DataTableFeatures, TData>[];
};

const DataTableSkeleton = <TData extends RowData>({ columns }: DataTableSkeletonProps<TData>) => {
    return (
        <div className='flex w-full max-w-sm flex-col gap-2'>
            {Array.from({ length: 10 }).map((_, index) => (
                <div className='flex gap-4' key={index}>
                    {Array.from({ length: columns.length }).map((_, index) => (
                        <Skeleton className='h-4 ' />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DataTableSkeleton;
