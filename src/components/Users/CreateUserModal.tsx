import { XCircleIcon } from '@heroicons/react/24/solid'
import { BookmarkSquareIcon } from '@heroicons/react/24/solid'
import { Modal, InputText, InputCheckbox, MsgError } from "@/components/General";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Role } from '@/api/role.service';
import { createUserApi, CreateUserData, updateUserApi, UpdateUserData } from '@/api/user.service';
import { useApiMutation } from '@/hooks/useApi';

const initialForm = {
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [] as string[],
};

type UserFormData = typeof initialForm & { id?: number };

type CreateUserModalProps = {
    isOpen: boolean;        
    onClose: () => void;
    rolesData: Role[];
    userToEdit?: UserFormData;
    reloadList?: () => void;
}

export default function CreateUserModal({ 
    isOpen, 
    onClose, 
    rolesData,
    userToEdit, 
    reloadList 
}: CreateUserModalProps) {

    const [formData, setFormData] = useState<UserFormData>(userToEdit ?? initialForm);
    const [error, setError] = useState<string | null>(null);
    const { run: createUser, loading: createLoading, error: createError, reset: resetCreate } = useApiMutation(createUserApi);
    const { run: updateUser, loading: updateLoading, error: updateError, reset: resetUpdate } = useApiMutation(updateUserApi);
    const loading = createLoading || updateLoading;
    const apiError = createError || updateError;
    const isEditMode = !!userToEdit?.id;

    useEffect(() => {
        if (userToEdit) {
            // Convertir roles de nombres a IDs para el formulario
            const userRoleIds = userToEdit.roles?.map((roleName: string) => {
                const role = rolesData.find(r => r.name === roleName);
                return role?.id.toString() || '';
            }).filter(Boolean) || [];
            
            setFormData({
                ...userToEdit,
                roles: userRoleIds
            });
        } else {
            setFormData(initialForm);
        }
    }, [userToEdit, rolesData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (roleId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            roles: checked 
                ? [...prev.roles, roleId]
                : prev.roles.filter(id => id !== roleId)
        }));
    };

    // Validar si el formulario está completo para campos obligatorios
    const isFormValid = formData.name.trim() !== "" && 
                       formData.username.trim() !== "" && 
                       formData.roles.length > 0 &&
                       (!isEditMode ? formData.password.trim() !== "" : true);

    const submit = async (): Promise<void> => {
        setError(null);
        
        // Validaciones básicas - solo campos obligatorios
        if (!formData.name.trim()) {
            setError("El nombre es requerido");
            return;
        }
        if (!formData.username.trim()) {
            setError("El nombre de usuario es requerido");
            return;
        }
        if (!isEditMode && !formData.password.trim()) {
            setError("La contraseña es requerida");
            return;
        }
        if (formData.roles.length === 0) {
            setError("Debe seleccionar al menos un rol");
            return;
        }

        try {
            if (isEditMode) {
                // Modo edición
                const userData: UpdateUserData = {
                    name: formData.name.trim(),
                    lastname: formData.lastname.trim() || undefined,
                    username: formData.username.trim(),
                    email: formData.email.trim() || undefined,
                    roles: formData.roles,
                };

                const res = await updateUser(formData.id!, userData);

                if (res.ok) {
                    toast.success(res.message || "Usuario actualizado exitosamente");
                    cancel();
                    reloadList?.();
                }
            } else {
                // Modo creación
                const userData: CreateUserData = {
                    name: formData.name.trim(),
                    lastname: formData.lastname.trim() || undefined,
                    username: formData.username.trim(),
                    email: formData.email.trim() || undefined,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    roles: formData.roles
                };

                const res = await createUser(userData);
                
                if (res.ok) {
                    toast.success(res.message || "Usuario creado exitosamente");
                    cancel();
                    reloadList?.();
                }
            }
        } catch (err: any) {
            // El error puede venir en diferentes formatos
            const errorMessage = err?.data?.error || err?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} usuario`;
            setError(errorMessage);
        }
    };

    const cleanErrors = (): void => {
        setError(null);
        resetCreate();
        resetUpdate();
    };

    const cancel = (): void => {
        setFormData(initialForm);
        cleanErrors();
        onClose();
    }

    // Limpiar errores y formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            cleanErrors();
            if (!userToEdit) {
                setFormData(initialForm);
            }
        }
    }, [isOpen, userToEdit]);

    return (
        <Modal
            title={isEditMode ? "Editar usuario" : "Crear usuario"}
            isOpen={isOpen}
            onClose={() => {
                cleanErrors();
                setFormData(initialForm);
                onClose();
            }}
            styles={{contentWidth:"w-[50%]"}}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <InputText 
                    label="Nombre" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Carlos"
                    maxLength={50}
                />
                
                {/* Apellido */}
                <InputText 
                    label="Apellido" 
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Ej: Rodríguez"
                    maxLength={50}
                />
                
                {/* Username */}
                <InputText 
                    label="Nombre de usuario" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    maxLength={30}
                />
                
                {/* Email */}
                <InputText 
                    label="Correo electrónico" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: carlos@empresa.com"
                    maxLength={100}
                />
                
                {/* Password - Solo en modo creación */}
                {!isEditMode && (
                    <InputText 
                        label="Contraseña" 
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                    />
                )}
                
                {/* Confirm Password - Solo en modo creación */}
                {!isEditMode && (
                    <InputText 
                        label="Confirmar contraseña" 
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repita la contraseña"
                    />
                )}
                
                {/* Roles */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roles del usuario
                    </label>
                    <div className="space-y-2">
                        {rolesData?.map(role => (
                            <InputCheckbox
                                key={role.id}
                                name={`role_${role.id}`}
                                label={role.name.toUpperCase()}
                                value={formData.roles.includes(role.id.toString())}
                                onChange={(e) => handleRoleChange(role.id.toString(), e.target.checked)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {(error || apiError) && <MsgError message={apiError?.data?.data?.error || apiError?.message || error || 'Error al procesar la solicitud'} />}
            
            <div className="mt-4 flex items-center justify-between">
                <button 
                    className="bg-red-1 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60"
                    onClick={cancel}
                    disabled={loading}
                >
                    <XCircleIcon className="size-7 text-yellow-1"/>
                    CANCELAR
                </button>
                <button 
                    className="bg-blue-2 py-2.5 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center mt-2 cursor-pointer hover-bg-black-1 w-60 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={submit}
                    disabled={loading || !isFormValid}
                >
                    <BookmarkSquareIcon className="size-7 text-yellow-1"/>
                    {loading ? "ENVIANDO": "GUARDAR"}
                </button>
            </div>
        </Modal>
    );
}