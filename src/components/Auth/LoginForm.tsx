import { useState, useMemo } from 'react';
import { InputText, MsgError, Spinner, FastyButton } from '@/components/General';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { loginUser } from "@/stores/auth/authActions";
import { setError } from '@/stores/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { BILLER_ROUTES } from '@/routes/names';
//
type LoginFormProps = {
    username?: string;
    password?: string;
}

export default function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector(s => s.auth);

    const [formData, setFormData] = useState<LoginFormProps>({
        username: "",
        password: "",
    });
    const formFill = formData.username.trim() !== '' && formData.password.trim() !== '';


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
         if (error) dispatch(setError(null));
    };

    const handleSubmit = async () => {
        if (formFill) {
            try {
                const { payload } = await dispatch(loginUser(formData));   
                if(payload.user){
                    navigate(BILLER_ROUTES.ROOT);
                }
            } catch (error) {
                console.error('Error en Login:', error);
            }
        }
    };
    return (
        <div>
            <div className="flex flex-col gap-6">
                <InputText 
                    label="Nombre de usuario" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ej: admin3000"
                />
                <InputText 
                    label="Contraseña" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="*********"
                />
            </div>
            {error && <MsgError message={error} />}
            <FastyButton
                type="primary"
                extraClassName="mt-6 px-4 py-2 w-full text-lg font-semibold"
                disabled={!formFill || loading}
                onClick={handleSubmit}
            >
                {/* {loading && <Spinner weight="3" size="size-6" colorClass="text-zinc-500"/>} */}
                {loading ? 'Espere un momento...' : 'Log in'}
            </FastyButton>
            
        </div>
    );
}

function validateFormData(data: LoginFormProps): boolean {
    return data.username.trim() && data.password.trim();
}