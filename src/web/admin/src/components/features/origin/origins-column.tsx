import { Origin } from '@org/schemas/admin';
import {
    Button,
    DataTableFeatures,
    DataTableSelect,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    useDataTableDateColumns,
} from '@org/shared-web';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useOriginColumns = () => {
    const { t } = useTranslation();
    const dateColumns = useDataTableDateColumns<Origin>();
    return useMemo(() => {
        const { accessor, columns, display } = createColumnHelper<DataTableFeatures, Origin>();
        return columns([
            DataTableSelect({ display }),
            accessor('origin', { header: t('origin') }),
            accessor('allowedHeaders', {
                header: t('allowed_headers'),
                cell: ({ row }) => {
                    const allowedHeaders = row.original.allowedHeaders;
                    return (
                        <div>
                            {allowedHeaders.map((header) => (
                                <p key={header}>{header}</p>
                            ))}
                        </div>
                    );
                },
            }),
            accessor('methods', {
                header: t('methods'),
                cell: ({ row }) => {
                    const methods = row.original.methods;
                    return (
                        <div>
                            {methods.map((method) => (
                                <p key={method}>{method}</p>
                            ))}
                        </div>
                    );
                },
            }),
            ...dateColumns,
            display({
                id: 'actions',
                cell: ({ row }) => {
                    const originId = row.original.originId;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={<Button variant='ghost' className='h-8 w-8 p-0' />}
                            >
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>View customer</DropdownMenuItem>
                                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            }),
        ]);
    }, [t, dateColumns]);
};
