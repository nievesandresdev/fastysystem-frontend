import { ReactNode, useEffect } from "react";
import '../css/Modal.css'
import { XCircleIcon } from '@heroicons/react/24/solid'


const stylesDefault = {
  contentWidth: "w-[94%]",
  bodyMaxHeight: "max-h-[86vh]",
}

type stylesProp = {
  contentWidth?: string;
};

type ModalProps = {
  isOpen: boolean;
  title: string;
  styles?: stylesProp;
  onClose: () => void;
  children: ReactNode;
  foot?: ReactNode;
};

export default function Modal({ isOpen, onClose, title, styles = stylesDefault, children, foot }: ModalProps) {

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);
  
  return (
    <div className={`overlay ${isOpen ? "show z-[2000]" : ""}`} onMouseDown={handleOverlayClick}>
      <div className={`content overflow-hidden rounded-[4px] min-w-[50%] max-w-[96%] ${styles?.contentWidth}`} onClick={(e) => e.stopPropagation()}>
        {/* head */}
        <div className="flex justify-between items-center px-4 py-1">
          <h1 className="text-[22px] font-semibold">{ title }</h1>
          <XCircleIcon onClick={onClose} className="size-6 cursor-pointer"/>
        </div>
        {/* body */}
        <div className={`pt-4 p-4 bg-zinc-200 rounded-b-[4px] overflow-y-auto max-h-[88vh]`}>
          {children}
        </div>
        {foot}
      </div>
    </div>
  );
}
