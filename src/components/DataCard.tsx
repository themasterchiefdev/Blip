

const DataCard = ({ item, onClick }: { item: any, onClick: () => void }) => {
    return (
        <div 
            onClick={onClick}
            className="group border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#CCFF00] hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col relative"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="bg-black text-white px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider">
                    {item.tool}
                </div>
                {item.source === 'awesome-copilot' && (
                    <div className="bg-[#CCFF00] text-black border-2 border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider transform rotate-2 group-hover:rotate-0 transition-transform">
                        AWESOME-COPILOT
                    </div>
                )}
            </div>
            
            <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-gray-700 transition-colors">{item.title}</h3>
            
            <p className="font-mono text-xs text-gray-600 line-clamp-3 bg-gray-50 p-3 border border-gray-200 flex-1 group-hover:border-black transition-colors">
                {item.content}
            </p>

            <div className="mt-auto pt-4 flex flex-wrap gap-2">
                <span className="border border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-gray-50">{item.category}</span>
                {item.tags.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-gray-500 font-mono text-[10px] py-0.5">#{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default DataCard;
