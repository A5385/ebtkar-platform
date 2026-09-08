import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { i18n } from '../i18n';
import { Button } from './ui/button';

export function LanguageSwitcher() {
    const { t } = useTranslation(undefined, { i18n });
    const isArabic = (i18n.resolvedLanguage ?? i18n.language) === 'ar';
    const nextLanguage = isArabic ? 'en' : 'ar';

    return (
        <Button
            aria-label={
                nextLanguage === 'ar' ? t('language.switchToArabic') : t('language.switchToEnglish')
            }
            onClick={() => void i18n.changeLanguage(nextLanguage)}
            size='sm'
            type='button'
            variant='outline'
        >
            <Languages aria-hidden='true' />
            {nextLanguage === 'ar' ? t('language.arabic') : t('language.english')}
        </Button>
    );
}
