import { routes } from '@/constants/route';
import { DashboardSection } from '@org/shared-web';
import { useTranslation } from 'react-i18next';
import OriginData from '../features/origin/origin-data';

const OriginPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <DashboardSection
                pageTitle={t(routes.originSettings.id)}
                pageIcon={routes.originSettings.icon}
            />
            <OriginData />
        </>
    );
};

export default OriginPage;
