import { ConfirmModal, CTAButton } from '@/components/General'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

type ConfirmDeleteProps = {
    isOpen: boolean;
    onClose: () => void;
    type?: 'error' | 'warning';
    content: ReactNode;
    onConfirm: () => void;
}

export default function ConfirmDelete({ isOpen, onClose, type = 'warning', content, onConfirm }: ConfirmDeleteProps) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            title="Confirmar eliminación"
            contentClassName="min-w-[340px]"
            onClose={onClose}
        > 
            <div className="bg-red-500 rounded-full size-11 py-1.5 mx-auto shadow-1">
                <ExclamationTriangleIcon className="mx-auto  size-8"/>
            </div>
            <h2 className="text-xl text-center font-bold">¿Estas seguro?</h2>
            <div className="bg-gray-1 rounded-md mt-2 p-2"> 
                { content }
                <CTAButton 
                    extraClassName="mt-4 mx-auto px-3 py-1 font-semibold"
                    onClick={onConfirm}
                >
                    Eliminar
                </CTAButton>
            </div>
        </ConfirmModal>
    );

}