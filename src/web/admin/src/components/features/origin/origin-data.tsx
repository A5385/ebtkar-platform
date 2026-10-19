// src\web\admin\src\components\features\origin\origin-data.tsx
import {
    DashboardSection,
    DataTable,
    UiButton,
    UiInput,
    UiSheetTrigger,
    useDataTableState,
    useDebouncedValue,
    useGetAllOrigins,
} from '@org/shared-web';
import { PlusIcon, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OriginForm from './origin-form';
import { useOriginColumns } from './origins-column';

const OriginData = () => {
    const { t } = useTranslation();
    const tableState = useDataTableState();
    const { setColumnFilters, setPagination } = tableState;

    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebouncedValue(search);

    useEffect(() => {
        setColumnFilters(debouncedSearch ? [{ id: 'origin', value: debouncedSearch }] : []);
        setPagination((p) => ({ ...p, pageIndex: 0 })); // back to page 1 on new filter
    }, [debouncedSearch, setColumnFilters, setPagination]);

    const { data, isLoading, refetch } = useGetAllOrigins({
        filters: tableState.columnFilters,
        sort: tableState.sorting,
        pagination: tableState.pagination,
    });

    const columns = useOriginColumns();

    return (
        <DashboardSection>
            <div className='flex items-center gap-4 w-full justify-end'>
                <UiButton onClick={() => refetch()}>
                    <RefreshCcw />
                </UiButton>{' '}
                <UiSheetTrigger
                    title={t('add_new_origin')}
                    sheet={<OriginForm />}
                    className={'bg-green-600 hover:bg-green-500 text-white'}
                >
                    <PlusIcon /> {t('add_new_origin')}
                </UiSheetTrigger>
            </div>
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
