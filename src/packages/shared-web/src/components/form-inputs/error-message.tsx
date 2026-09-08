import { useTranslation } from 'react-i18next';
import { FieldError } from '../ui/field';

type Props = {
    message?: string;
};

export const FormErrorMessage = ({ message }: Props) => {
    const { t } = useTranslation();

    if (!message) return null;
    return (
        <FieldError>
            {t(`api_message.error.${message}`, {
                defaultValue: t(message, { defaultValue: message }),
            })}
        </FieldError>
    );
};
