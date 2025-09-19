

type CTAButtonProps = {
    children: React.ReactNode;
    extraClassName?: string;
    onClick?: () => void;
    disabled?: boolean;
};

export default function CTAButton({ children, extraClassName, onClick, disabled = false }: CTAButtonProps) {
    return (
        <button 
            className={`bg-red-1 hover-bg-black-1 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center cursor-pointer ${extraClassName}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}