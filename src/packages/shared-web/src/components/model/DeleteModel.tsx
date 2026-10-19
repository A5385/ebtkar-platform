import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckIcon, Trash } from 'lucide-react';
import { UiButton, type UiButtonProps } from '../system/ui-button';

type DeleteModelProps = {
    message: ReactNode;
    confirm?: UiButtonProps;
    cancel?: UiButtonProps;
};

export const DeleteModel = ({ message, confirm, cancel }: DeleteModelProps) => {
    const { t } = useTranslation();

    const {
        children: confirmTitle,
        onClick: confirmDelete,
        variant: confirmVariant = 'destructive',

        ...confirmProps
    } = confirm ?? {};

    const {
        children: cancelTitle,
        onClick: cancelDelete,
        variant: cancelVariant = 'outline',
        className: cancelClassName = 'text-green-600 max-w-250 ',
        ...cancelProps
    } = cancel ?? {};

    return (
        <div>
            <p>{message}</p>

            <div className='mt-4 flex items-center justify-center gap-8 w-full'>
                <UiButton {...confirmProps} variant={confirmVariant} onClick={confirmDelete}>
                    <Trash color='red' /> {confirmTitle ?? t('yes_delete_it')}
                </UiButton>

                <UiButton
                    {...cancelProps}
                    variant={cancelVariant}
                    onClick={cancelDelete}
                    className={cancelClassName}
                >
                    <CheckIcon color='green' /> {cancelTitle ?? t('no_keep_it')}
                </UiButton>
            </div>
        </div>
    );
};
