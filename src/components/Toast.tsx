import { useEffect } from 'react';
import { Check } from 'lucide-react';

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-black text-[#CCFF00] border-2 border-[#CCFF00] px-6 py-3 shadow-[4px_4px_0px_#CCFF00] flex items-center gap-3 font-mono font-bold">
                <Check size={18} />
                {message}
            </div>
        </div>
    );
};

export default Toast;
