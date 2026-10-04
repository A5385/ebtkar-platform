'use client';

import { type ReactTable, type RowData } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DataTableFeatures } from './data-table-features';

export function DataTableViewOptions<TData extends RowData>({
    table,
}: {
    table: ReactTable<DataTableFeatures, TData>;
}) {
    const { t } = useTranslation();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant='outline' size='sm' />}>
                <Settings2 /> {t('view_columns')}
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-37.5'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{t('toggle_columns')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className='capitalize'
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
