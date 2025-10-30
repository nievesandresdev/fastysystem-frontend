import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { FlexTable } from '@/components/General';
import { CreateUserModal } from '@/components/Users';
import { ConfirmDelete } from '@/components/General';
import { useState } from 'react';
import { getAllRolesApi } from '@/api/role.service';
import { getAllUsersApi } from '@/api/user.service';
import { useApiQuery } from '@/hooks/useApi';
import { useAppDispatch } from '@/hooks/store';
import { setIsExchangeSettingOpen } from '@/stores/exchange/exchangeSlice';

export default function ListUsers(){
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<any>(null);
    const dispatch = useAppDispatch();
    
    // Cargar roles desde la API
    const { data: rolesResponse } = useApiQuery(getAllRolesApi);
    const rolesData = rolesResponse?.data || [];

    // Cargar usuarios desde la API
    const { data: usersResponse, loading: usersLoading, refetch: reloadUsers } = useApiQuery(getAllUsersApi);
    const usersData = usersResponse?.data || [];

    return (
        <>
        <section className="bg-gray-1 py-4 border-t-3 border-yellow-1">
            <div className="relative px-4 border-b-3 border-yellow-1 pb-4 flex items-center">
                <h1 className="text-xl font-semibold">Lista de Usuarios</h1>
                <button 
                    className="px-4 rounded-[4px] text-yellow-1 text-base py-3 font-semibold bg-blue-2 hover-bg-black-1 mt-auto cursor-pointer flex items-center gap-2 ml-auto"
                    onClick={() => dispatch(setIsExchangeSettingOpen(true))}
                >
                    <CurrencyDollarIcon className="size-6"/>
                    Actualizar tasa
                </button>
                <button 
                    className="px-4 rounded-[4px] text-yellow-1 text-base py-3 font-semibold bg-black-1 hover-bg-orange-1 mt-auto cursor-pointer flex items-center gap-2 ml-6"
                    onClick={() => setCreateUserModalOpen(true)}
                >
                    <PencilSquareIcon className="size-6"/>
                    Crear usuario
                </button>
            </div>
            <div className="px-4 pt-1">
                <FlexTable
                    columns={[
                        { 
                            key: "name", label: "NOMBRES", className: "w-[30%] bg-white",
                            render: (user) => (
                                <div className="text-base font-bold text-left truncate">
                                    {user.name} {user.lastname || ''}
                                </div>
                            )
                        },
                        {
                            key: "email", label: "CORREO", className: "flex-grow bg-gray-100",
                            render: (user) => (
                                <div className="text-base text-center">
                                    {user.email || 'Sin email'}
                                </div>
                            )
                        },
                        {
                            key: "username", label: "USERNAME", className: "w-[20%] bg-blue-100",
                            render: (user) => (
                                <div className="text-base text-center">
                                    {user.username}
                                </div>
                            )
                        },
                        {
                            key: "roles", label: "ROL(ES)", className: "w-[14%] bg-orange-100",
                            render: (user) => (
                                <div className="text-sm text-center font-bold">
                                    {user.roles?.join(' | ')}
                                </div>
                            )
                        },
                        {
                            key: "actions", label: "ACCIONES", className: "w-[8%] bg-red-100",
                            render: (user) => (
                                <div className="flex items-center justify-center gap-4">
                                    <PencilSquareIcon 
                                        className="size-6 cursor-pointer hover-text-blue-1"
                                        onClick={() => {
                                            setUserToEdit(user);
                                            setCreateUserModalOpen(true);
                                        }}
                                    />
                                </div>
                            )
                        }
                    ]}
                    data={usersData}
                    isLoading={usersLoading}
                    hoverSelect={false}
                />
            </div>
        </section>
        <CreateUserModal 
            isOpen={isCreateUserModalOpen} 
            onClose={() => {
                setCreateUserModalOpen(false);
                setUserToEdit(null);
            }} 
            rolesData={rolesData}
            userToEdit={userToEdit}
            reloadList={reloadUsers}
        />
        <ConfirmDelete 
            isOpen={isConfirmDeleteOpen} 
            onClose={() => setConfirmDeleteOpen(false) }
            content={<p className="text-center text-base leading-5">Se eliminara el usuario: <br /><strong> Pedro zapata</strong></p>}
            onConfirm={() => {}}
        >
        </ConfirmDelete>
        </>
    );
}