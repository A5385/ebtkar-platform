import { UiButton, useSearchParams } from '@org/shared-web';

const SetNewPasswordForm = () => {
    const params = useSearchParams();
    const changeStep = () => {
        params.set({ step: String(4) });
    };
    return (
        <div>
            password
            <UiButton onClick={changeStep}>verify</UiButton>
        </div>
    );
};

export default SetNewPasswordForm;
