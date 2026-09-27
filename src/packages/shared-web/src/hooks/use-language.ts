import { useTranslation } from 'react-i18next';
import { i18n } from '../i18n';

export const useLanguage = () => {
    const { t } = useTranslation(undefined, { i18n });
    const isArabic = (i18n.resolvedLanguage ?? i18n.language) === 'ar';
    const nextLanguage = isArabic ? 'en' : 'ar';

    const changeLanguage = () => {
        i18n.changeLanguage(nextLanguage);
    };

    return {
        isArabic: i18n.language === 'ar',
        t,
        nextLanguage,
        title: nextLanguage === 'ar' ? t('language.arabic') : t('language.english'),
        changeLanguage,
    };
};
