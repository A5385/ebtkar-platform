import { CreateOriginFormType } from '@org/schemas/admin';
import { DashboardSection } from '@org/shared-web';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

type OriginFormProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    originId?: string;
};
const OriginForm = ({ open, setOpen, originId }: OriginFormProps) => {
    const form = useForm<CreateOriginFormType>({});
    return <DashboardSection>{originId ? originId : 'new origin'}</DashboardSection>;
};

export default OriginForm;
