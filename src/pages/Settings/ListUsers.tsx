import { TrashIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
// import { CreateUserModal } from '@/components/Users';
import { ConfirmDelete } from '@/components/General';
import { useState } from 'react';

export default function ListUsers(){
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    return (
        <>
        <section className="bg-gray-1 py-4 border-t-3 border-yellow-1">
            <div className="relative px-4 border-b-3 border-yellow-1 pb-4 flex items-center">
                <h1 className="text-xl font-semibold">Lista de Usuarios</h1>
                <button 
                    className="px-4 rounded-[4px] text-yellow-1 text-base py-3 font-semibold bg-blue-2 hover-bg-black-1 mt-auto cursor-pointer flex items-center gap-2 ml-auto"
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
                <div className="flex border-x pb-0.5">
                    <div className="flex-grow text-base border-x px-1 font-bold text-center bg-white">NOMBRES</div>
                    <div className="w-[28%] text-base border-x px-1 font-bold text-center bg-gray-100">CORREO</div>
                    <div className="w-[16%] text-base border-x px-1 font-bold text-center bg-blue-100">USERNAME</div>
                    <div className="w-[12%] text-base border-x px-1 font-bold text-center bg-orange-100">ROL(ES)</div>
                    <div className="w-[14%] text-base border-x px-1 font-bold text-center bg-red-100">Acciones</div>
                </div>
                <div className="flex border-x">
                    <div className="flex-grow text-base border-x px-1 font-bold text-center bg-white">ANDRES NIEVES</div>
                    <div className="w-[28%] text-base border-x px-1 font-bold text-center bg-gray-100">ANDRES@EMAIL.COM</div>
                    <div className="w-[16%] text-base border-x px-1 font-bold text-center bg-blue-100">ANDRESNIEVES</div>
                    <div className="w-[12%] text-base border-x px-1 font-bold text-center bg-orange-100">
                        ADMIN 
                        VENDEDOR
                    </div>
                    <div className="w-[14%] text-base border-x px-1 font-bold text-center bg-red-100 flex items-center justify-center gap-4">
                        <TrashIcon 
                            className="size-6 cursor-pointer hover-text-red-1"
                            onClick={() => setConfirmDeleteOpen(true) }
                        />
                        <PencilSquareIcon className="size-6 cursor-pointer hover-text-blue-1"/>
                    </div>
                </div>
            </div>
        </section>
        {/* <CreateUserModal isOpen={isCreateUserModalOpen} onClose={() => setCreateUserModalOpen(false)} /> */}
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