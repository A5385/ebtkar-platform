import {
    DashboardSection,
    Sheet,
    SheetContent,
    SheetTrigger,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    UiButton,
    useGetAllOrigins,
} from '@org/shared-web';
import { EditIcon } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OriginForm from './origin-form';

const OriginData = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllOrigins();

    const [addOpen, setAddOpen] = useState(false);
    const [selectedOriginId, setSelectedOriginId] = useState<string | null>(null);

    const columns = useMemo(() => {
        if (!data?.length) return [];

        return Object.keys(data[0]) as (keyof (typeof data)[number])[];
    }, [data]);

    if (isLoading) return <div>Loading....</div>;

    return (
        <DashboardSection>
            {/* Add */}
            <UiSheet open={addOpen} setOpen={setAddOpen} title='add_new_origin'>
                <OriginForm open={addOpen} setOpen={setAddOpen} />
            </UiSheet>

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((key) => (
                            <TableHead key={String(key)}>{t(String(key))}</TableHead>
                        ))}

                        <TableHead>{t('actions')}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.map((row) => (
                        <TableRow key={row.originId}>
                            {columns.map((key) => (
                                <TableCell key={String(key)}>{String(row[key] ?? '')}</TableCell>
                            ))}

                            <TableCell>
                                <UiButton onClick={() => setSelectedOriginId(row.originId)}>
                                    <EditIcon size={16} />
                                </UiButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit */}
            <UiSheet
                open={!!selectedOriginId}
                setOpen={(open) => {
                    if (!open) setSelectedOriginId(null);
                }}
            >
                {selectedOriginId && (
                    <OriginForm
                        open={!!selectedOriginId}
                        setOpen={(open) => {
                            if (!open) setSelectedOriginId(null);
                        }}
                        originId={selectedOriginId}
                    />
                )}
            </UiSheet>
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
