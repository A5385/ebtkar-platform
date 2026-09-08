import { UiButton, useSearchParams } from '@org/shared-web';

const VerifyOtpForm = () => {
    const params = useSearchParams();
    const changeStep = () => {
        params.set({ step: String(3) });
    };
    return (
        <div>
            otp
            <UiButton onClick={changeStep}>verify</UiButton>
        </div>
    );
};

export default VerifyOtpForm;
