import { type AccessorKeyColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../helpers';
import { type DataTableFeatures } from './data-table-features';

type DateTableRow = {
    createdAt: Date;
    updatedAt: Date;
};
export const useDataTableDateColumns = <TData extends DateTableRow>(): AccessorKeyColumnDef<
    DataTableFeatures,
    TData,
    Date
>[] => {
    const { t } = useTranslation();

    return useMemo(() => {
        const { accessor } = createColumnHelper<DataTableFeatures, DateTableRow>();

        return [
            accessor('createdAt', {
                header: t('created_at'),
                cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
            }),
            accessor('updatedAt', {
                header: t('updated_at'),
                cell: ({ row }) => <div>{formatDate(row.original.updatedAt)}</div>,
            }),
        ] as unknown as AccessorKeyColumnDef<DataTableFeatures, TData, Date>[];
    }, [t]);
};
