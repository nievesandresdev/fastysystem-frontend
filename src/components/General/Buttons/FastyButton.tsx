

type CTAButtonProps = {
    type?: 'cta' | 'primary' | 'secondary' | 'orange';
    disabled?: boolean;
    children: React.ReactNode;
    extraClassName?: string;
    onClick?: () => void;
};

const typeBg ={
    cta: 'bg-red-1',
    primary: 'bg-blue-1',
    secondary: 'bg-blue-2',
    orange: 'bg-orange-1',
}
export default function FastyButton({ disabled = false, type, children, extraClassName, onClick }: CTAButtonProps) {
    return (
        <button 
            className={`${typeBg[type]} hover-bg-black-1 rounded-[4px] text-yellow-1 flex items-center gap-2 justify-center cursor-pointer ${extraClassName}`}
            type="button"
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}