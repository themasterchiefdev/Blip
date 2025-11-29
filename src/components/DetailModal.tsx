import { X, Copy } from 'lucide-react';

const DetailModal = ({ item, onClose, onCopy }: { item: any, onClose: () => void, onCopy: (msg: string) => void }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(item.content);
        const messages = [
            "PROMPT STOLEN (IT'S YOURS NOW)",
            "CTRL+C, CTRL+V, PROFIT",
            "YOINK!",
            "KNOWLEDGE_TRANSFER_COMPLETE",
            "PASTE IT LIKE YOU OWN IT"
        ];
        onCopy(messages[Math.floor(Math.random() * messages.length)]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="bg-white border-2 border-black shadow-[12px_12px_0px_#000] w-full max-w-3xl max-h-[85vh] flex flex-col relative animate-in zoom-in-95 duration-200" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b-2 border-black bg-gray-50">
                    <div className="flex items-center gap-4">
                        <span className="border-2 border-black bg-[#CCFF00] px-2 py-1 font-mono font-bold text-sm shadow-[2px_2px_0px_#000]">
                            {item.id}
                        </span>
                        <h2 className="font-black text-2xl tracking-tight">{item.title}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="group p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all"
                    >
                        <X size={24} />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="bg-black text-white px-3 py-1 font-mono text-xs font-bold uppercase">{item.tool}</span>
                        <span className="border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase bg-white">{item.category}</span>
                        {item.tags.map((tag: string) => (
                            <span key={tag} className="text-gray-500 font-mono text-xs py-1">#{tag}</span>
                        ))}
                    </div>

                    <div className="relative group">
                        <div className="absolute -top-3 left-4 bg-white px-2 font-mono text-xs font-bold border-x border-t border-black z-10">
                            PROMPT_CONTENT
                        </div>
                        <pre className="whitespace-pre-wrap bg-[#F5F5F5] p-6 border-2 border-black font-mono text-sm leading-relaxed min-h-[200px] shadow-inner">
                            {item.source === 'awesome-copilot' && (
                                <div className="mb-6 pb-4 border-b-2 border-dashed border-gray-300 text-gray-500 font-bold text-xs">
                                    &gt; WARNING: STOLEN FROM A GENIUS. CREDIT: AWESOME-COPILOT.<br/>
                                    &gt; I'D CLAIM THIS, BUT MY LAWYER SAID NO.<br/>
                                    &gt; ---------------------------------------------------
                                </div>
                            )}
                            {item.content}
                        </pre>
                    </div>
                </div>

                <div className="p-5 border-t-2 border-black flex justify-between items-center bg-gray-50">
                    <span className="font-mono text-xs text-gray-400 hidden sm:inline">PRESS ESC TO CLOSE</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-8 py-3 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_#000] bg-white hover:bg-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all w-full sm:w-auto justify-center"
                    >
                        <Copy size={18} />
                        STEAL THIS PROMPT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
