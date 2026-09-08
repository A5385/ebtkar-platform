import { useSearchParams } from '@org/shared-web';
import ProfileForm from './ProfileForm';
import SetNewPasswordForm from './SetNewPasswordForm';
import VerifyEmailForm from './VerifyEmailForm';
import VerifyOtpForm from './VerifyOtpForm';

const RegisterForm = () => {
    const params = useSearchParams();
    const step = Number(params.get('step'));

    return (
        <div>
            {(step === 1 || !step) && <VerifyEmailForm />}
            {step === 2 && <VerifyOtpForm />}
            {step === 3 && <SetNewPasswordForm />}
            {step === 4 && <ProfileForm />}
        </div>
    );
};

export default RegisterForm;
