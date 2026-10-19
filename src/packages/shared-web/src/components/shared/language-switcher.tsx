import { Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/use-language';
import { UiButton } from '../system/ui-button';

export function LanguageSwitcher() {
    const { title, changeLanguage, nextLanguage, t } = useLanguage();
    return (
        <UiButton
            aria-label={
                nextLanguage === 'ar' ? t('language.switchToArabic') : t('language.switchToEnglish')
            }
            onClick={changeLanguage}
            size='sm'
            type='button'
            variant='outline'
        >
            <Languages aria-hidden='true' />
            {title}
        </UiButton>
    );
}
