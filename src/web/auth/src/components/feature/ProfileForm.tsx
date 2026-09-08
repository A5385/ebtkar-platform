import { UiButton, useSearchParams } from '@org/shared-web';
import { useNavigate } from '@tanstack/react-router';

const ProfileForm = () => {
    const params = useSearchParams();
    const email = params.get('email');
    const navigate = useNavigate();
    return (
        <div>
            profile
            <UiButton
                onClick={() => {
                    params.remove('step');
                    navigate({ to: '/auth/login', params: { email } });
                }}
            >
                save
            </UiButton>
        </div>
    );
};

export default ProfileForm;
