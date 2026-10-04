// src\web\admin\src\components\features\origin\origin-data.tsx
import {
    DashboardSection,
    DataTable,
    Sheet,
    SheetContent,
    SheetTrigger,
    UiButton,
    UiInput,
    useDataTableState,
    useDebouncedValue,
    useGetAllOrigins,
} from '@org/shared-web';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOriginColumns } from './origins-column';

const OriginData = () => {
    const { t } = useTranslation();
    const tableState = useDataTableState();
    const { setColumnFilters, setPagination } = tableState;

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebouncedValue(search);

    useEffect(() => {
        setColumnFilters(debouncedSearch ? [{ id: 'origin', value: debouncedSearch }] : []);
        setPagination((p) => ({ ...p, pageIndex: 0 })); // back to page 1 on new filter
    }, [debouncedSearch, setColumnFilters, setPagination]);

    const { data, isLoading } = useGetAllOrigins({
        filters: tableState.columnFilters,
        sort: tableState.sorting,
        pagination: tableState.pagination,
    });

    const columns = useOriginColumns();

    return (
        <DashboardSection>
            <DataTable
                {...{ data, isLoading, columns, ...tableState }}
                filters={
                    <UiInput
                        type='text'
                        placeholder={t('origins')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='max-w-sm'
                    />
                }
            />
        </DashboardSection>
    );
};

export default OriginData;
const UiSheet = ({
    open,
    setOpen,
    children,
    title,
    icon,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    children?: ReactNode;
    title?: string;
    icon?: ReactNode;
}) => {
    const { t } = useTranslation();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {(title || icon) && (
                <SheetTrigger
                    render={() => (
                        <UiButton>
                            {icon}
                            {title && t(title)}
                        </UiButton>
                    )}
                />
            )}

            <SheetContent>{children}</SheetContent>
        </Sheet>
    );
};
