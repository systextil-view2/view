type Props = {
    variant?: 'danger' | 'warn' | 'accept' | 'default';
    children: React.ReactNode;
    onClick?: () => void;
    padding: string;
}

export function Button({ variant = 'default', children, onClick, padding }: Props) {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'danger':
                return '#ef4444'; // vermelho
            case 'warn':
                return '#f59e0b'; // amarelo/laranja
            case 'accept':
                return '#10b981'; // verde
            default:
                return '#3b82f6'; // azul padrão
        }
    };

    return (
        <button 
            style={{ backgroundColor: getBackgroundColor(), padding: padding}}
            onClick={onClick}
            className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
        >
            {children}
        </button>
    );
}