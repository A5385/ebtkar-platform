import type { Origin } from '@org/schemas/admin/schema';
import {
    Button,
    DataTableFeatures,
    DataTableSelect,
    DeleteModel,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    useDataTableDateColumns,
    useDeleteOrigin,
    useDialog,
    useSheet,
} from '@org/shared-web';
import { createColumnHelper } from '@tanstack/react-table';
import { CheckCheckIcon, EditIcon, MoreHorizontal, Trash, X } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import OriginForm from './origin-form';

export const useOriginColumns = () => {
    const { openDialog, closeDialog } = useDialog();
    const { openSheet } = useSheet();
    const { t } = useTranslation();
    const dateColumns = useDataTableDateColumns<Origin>();

    const deleteOrigin = useDeleteOrigin();

    return useMemo(() => {
        const { accessor, columns, display } = createColumnHelper<DataTableFeatures, Origin>();
        return columns([
            DataTableSelect({ display }),
            accessor('origin', { header: t('origin') }),
            accessor('credentials', {
                header: t('credentials'),
                cell: ({ row }) => {
                    return (
                        <span>
                            {row.original.credentials ? (
                                <CheckCheckIcon color='green' />
                            ) : (
                                <X color='red' />
                            )}
                        </span>
                    );
                },
            }),
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
                    const origin = row.original;

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
                                    <DropdownMenuItem
                                        onClick={() =>
                                            openSheet({
                                                title: 'Update origin',
                                                description: 'Update origin to the system',
                                                sheet: <OriginForm origin={origin} />,
                                            })
                                        }
                                    >
                                        <EditIcon color='gray' /> {t('edit')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            openDialog({
                                                dialog: (
                                                    <DeleteModel
                                                        message={t(
                                                            'are_you_sure_you_want_to_delete_this_origin',
                                                            { origin: origin.origin },
                                                        )}
                                                        confirm={{
                                                            onClick: async () => {
                                                                await deleteOrigin.mutateAsync(
                                                                    {
                                                                        id: origin.originId,
                                                                    },
                                                                    {
                                                                        onSuccess() {
                                                                            closeDialog();
                                                                        },
                                                                    },
                                                                );
                                                            },
                                                        }}
                                                        cancel={{
                                                            onClick: () => {
                                                                closeDialog();
                                                            },
                                                        }}
                                                    />
                                                ),
                                            })
                                        }
                                        className={'text-red-500'}
                                    >
                                        <Trash color='red' />
                                        {t('delete')}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            }),
        ]);
    }, [t, dateColumns, openSheet, openDialog, deleteOrigin, closeDialog]);
};
