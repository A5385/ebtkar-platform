import { routes } from '@/constants/route';
import { DashboardSection } from '@org/shared-web';
import { useTranslation } from 'react-i18next';
import NetworkForm from '../features/network/network-form';

const NetworkPage = () => {
    const { t } = useTranslation();
    return (
        <div className='w-full'>
            <DashboardSection
                pageTitle={t(routes.networkSettings.id)}
                pageIcon={routes.networkSettings.icon}
            />
            <NetworkForm />
        </div>
    );
};

export default NetworkPage;
