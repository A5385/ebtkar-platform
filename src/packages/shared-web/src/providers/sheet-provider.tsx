import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    UiButton,
    UiButtonProps,
} from '../components';

export interface OpenSheetOptions {
    title?: ReactNode;
    description?: ReactNode;
    sheet: ReactNode;
}

interface SheetContextProps {
    openSheet: (options: OpenSheetOptions) => void;
    closeSheet: () => void;
}

interface SheetState extends OpenSheetOptions {
    open: boolean;
}

const SheetContext = createContext<SheetContextProps | null>(null);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
    const [sheet, setSheet] = useState<SheetState>({
        open: false,
        sheet: null,
    });

    const openSheet = useCallback((options: OpenSheetOptions) => {
        setSheet({
            ...options,
            open: true,
        });
    }, []);

    const closeSheet = useCallback(() => {
        setSheet((current) => ({
            ...current,
            open: false,
        }));
    }, []);

    return (
        <SheetContext.Provider value={{ openSheet, closeSheet }}>
            {children}

            <Sheet
                open={sheet.open}
                onOpenChange={(open) => {
                    if (!open) closeSheet();
                }}
            >
                <SheetContent>
                    {(sheet.title || sheet.description) && (
                        <SheetHeader>
                            {sheet.title && <SheetTitle>{sheet.title}</SheetTitle>}

                            {sheet.description && (
                                <SheetDescription>{sheet.description}</SheetDescription>
                            )}
                        </SheetHeader>
                    )}

                    {sheet.sheet}
                </SheetContent>
            </Sheet>
        </SheetContext.Provider>
    );
};

export const useSheet = () => {
    const context = useContext(SheetContext);

    if (!context) {
        throw new Error('useSheet must be used within a SheetProvider');
    }

    return context;
};

type UiSheetTriggerProps = Omit<UiButtonProps, keyof OpenSheetOptions> & OpenSheetOptions;

export const UiSheetTrigger = ({
    title,
    description,
    sheet,
    children,
    onClick,
    ...props
}: UiSheetTriggerProps) => {
    const { openSheet } = useSheet();

    return (
        <UiButton
            {...props}
            onClick={(event) => {
                onClick?.(event);
                openSheet({ title, description, sheet });
            }}
        >
            {children}
        </UiButton>
    );
};
