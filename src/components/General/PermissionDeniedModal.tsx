// src/components/General/PermissionDeniedModal.tsx
import Modal from './Modal/Modal';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface PermissionDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function PermissionDeniedModal({ 
  isOpen, 
  onClose, 
  message = "No tienes permisos para realizar esta acción" 
}: PermissionDeniedModalProps) {
  return (
    <Modal
      title="Acceso Denegado"
      isOpen={isOpen}
      onClose={onClose}
      styles={{ contentWidth: "w-[40%]" }}
    >
      <div className="flex flex-col items-center justify-center py-6">
        <ExclamationCircleIcon className="size-16 text-red-500 mb-4" />
        <p className="text-lg text-center text-gray-700 mb-6">
          {message}
        </p>
        <button
          className="bg-blue-2 py-2.5 px-6 rounded-[4px] text-yellow-1 font-semibold hover:bg-black-1 transition-colors"
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </Modal>
  );
}
