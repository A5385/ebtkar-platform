import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    UiButton,
    type UiButtonProps,
} from '../components';

export interface OpenDialogOptions {
    title?: ReactNode;
    description?: ReactNode;
    dialog: ReactNode;
}

interface DialogContextProps {
    openDialog: (options: OpenDialogOptions) => void;
    closeDialog: () => void;
}

interface DialogState extends OpenDialogOptions {
    open: boolean;
}

const DialogContext = createContext<DialogContextProps | null>(null);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialog, setDialog] = useState<DialogState>({
        open: false,
        dialog: null,
    });

    const openDialog = useCallback((options: OpenDialogOptions) => {
        setDialog({
            ...options,
            open: true,
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialog((current) => ({
            ...current,
            open: false,
        }));
    }, []);

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}

            <Dialog
                open={dialog.open}
                onOpenChange={(open) => {
                    if (!open) closeDialog();
                }}
            >
                <DialogContent>
                    {(dialog.title || dialog.description) && (
                        <DialogHeader>
                            {dialog.title && <DialogTitle>{dialog.title}</DialogTitle>}

                            {dialog.description && (
                                <DialogDescription>{dialog.description}</DialogDescription>
                            )}
                        </DialogHeader>
                    )}

                    {dialog.dialog}
                </DialogContent>
            </Dialog>
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }

    return context;
};

type UiDialogTriggerProps = Omit<UiButtonProps, keyof OpenDialogOptions> & OpenDialogOptions;

export const UiDialogTrigger = ({
    title,
    description,
    dialog,
    children,
    onClick,
    ...props
}: UiDialogTriggerProps) => {
    const { openDialog } = useDialog();

    return (
        <UiButton
            {...props}
            onClick={(event) => {
                onClick?.(event);
                openDialog({ title, description, dialog });
            }}
        >
            {children}
        </UiButton>
    );
};
