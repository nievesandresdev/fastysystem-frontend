import { ReactNode } from "react";
import '../css/ConfirmModal.css'
import { XCircleIcon } from '@heroicons/react/24/solid'


type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  contentClassName?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function ConfirmModal({ isOpen, title, contentClassName, onClose, children }: ConfirmModalProps) {
  return (
    <div className={`overlay z-[1000] ${isOpen ? "show" : ""}`} onClick={onClose}>
      <div className={`content overflow-hidden rounded-md ${contentClassName}`} onClick={(e) => e.stopPropagation()}>
        {/* head */}
        <div className="flex justify-between items-center px-4 py-1">
          <h1 className="text-[22px] font-semibold">{ title }</h1>
          <XCircleIcon onClick={onClose} className="size-6 cursor-pointer"/>
        </div>
        {/* body */}
        <div className="pt-4 p-4 bg-zinc-200 rounded-b-[4px] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
