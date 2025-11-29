import { X, ExternalLink } from 'lucide-react';
import prompts from '../data/prompts.json';
import { RANKS } from '../constants';
import IconMap from './IconMap';

const Sidebar = ({ activeFilter, setActiveFilter, externalRepos, className = "", onClose, onCoffeeClick, onLogoClick, coffeeStatus, xp }: { activeFilter: string, setActiveFilter: (f: string) => void, externalRepos: any[], className?: string, onClose?: () => void, onCoffeeClick: () => void, onLogoClick: () => void, coffeeStatus: 'CRITICAL' | 'OPTIMAL', xp: number }) => {
    const tools = ['All', ...Array.from(new Set(prompts.map(item => item.tool)))];
    const currentRank = RANKS.slice().reverse().find(r => xp >= r.threshold) || RANKS[0];
    const nextRank = RANKS.find(r => r.threshold > xp);
    const progress = nextRank ? ((xp - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100 : 100;

    return (
        <aside className={`w-64 border-r-2 border-black flex flex-col h-full bg-white ${className}`}>
            <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                <div 
                    className="border-2 border-black p-3 text-center shadow-[4px_4px_0px_#000] bg-white w-full cursor-pointer active:translate-y-1 active:shadow-none transition-all select-none"
                    onClick={onLogoClick}
                >
                    <h1 className="font-black text-2xl tracking-tighter leading-none glitch-hover">BLIP</h1>
                    <p className="text-[10px] font-mono mt-1 text-gray-500">BORING LIST [OF] INTELLIGENT PROMPTS</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden ml-4 p-1 border-2 border-transparent hover:border-black">
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="mb-6">
                    <h3 className="font-mono text-xs font-bold text-gray-400 mb-3 tracking-wider">CHOOSE_WEAPON</h3>
                    <div className="space-y-2">
                        {tools.map(tool => (
                            <button
                                key={tool}
                                onClick={() => { setActiveFilter(tool); onClose?.(); }}
                                className={`w-full text-left px-4 py-2 border-2 border-black font-mono text-sm transition-all duration-150
                                    ${activeFilter === tool 
                                        ? 'bg-black text-[#CCFF00] shadow-[2px_2px_0px_#CCFF00] translate-x-1 translate-y-1' 
                                        : 'bg-white hover:bg-gray-100 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'
                                    }`}
                            >
                                {tool === 'All' ? 'EVERYTHING' : tool.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t-2 border-black bg-gray-50">
                <h3 className="font-mono text-xs font-bold text-gray-400 mb-3 tracking-wider">RABBIT_HOLES</h3>
                <div className="space-y-2">
                    {externalRepos.map((repo, idx) => (
                        <a
                            key={idx}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 w-full px-3 py-2 border-2 border-black bg-white font-mono text-xs shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] transition-all"
                        >
                            <IconMap name={repo.icon} size={14} />
                            <span className="truncate">{repo.label}</span>
                        </a>
                    ))}
                    <button
                        onClick={() => alert("I TOLD YOU NOT TO CLICK. NOW YOU HAVE TO LIVE WITH THE GUILT.")}
                        className="flex items-center gap-2 w-full px-3 py-2 border-2 border-black bg-red-50 font-mono text-xs shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] transition-all text-red-600 font-bold"
                    >
                        <ExternalLink size={14} />
                        <span>DO_NOT_CLICK</span>
                    </button>
                </div>
                </div>


            <div className="p-4 border-t-2 border-black bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] font-bold text-gray-400">RANK: {currentRank.title}</span>
                    <span className="font-mono text-[10px] font-bold text-black">{xp} XP</span>
                </div>
                <div className="h-2 w-full border-2 border-black bg-white p-0.5 mb-4">
                    <div className="h-full bg-black transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div 
                    className="cursor-pointer hover:bg-gray-100 transition-colors group"
                    onClick={onCoffeeClick}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] font-bold text-gray-400 group-hover:text-black">COFFEE_LEVEL</span>
                        <span className={`font-mono text-[10px] font-bold ${coffeeStatus === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                            {coffeeStatus}
                        </span>
                    </div>
                    <div className="h-2 w-full border-2 border-black bg-white p-0.5">
                        <div 
                            className={`h-full transition-all duration-500 ${coffeeStatus === 'CRITICAL' ? 'w-[15%] bg-black' : 'w-full bg-[#CCFF00]'}`}
                        ></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
