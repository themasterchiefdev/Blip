import { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Copy, ExternalLink, Github, ShieldAlert, Check, Shuffle, Command, X, Menu, ArrowRight } from 'lucide-react';

// --- DATA SOURCE ---
const INITIAL_STATE = {
  "meta": {
    "version": "1.2",
    "maintainer": "Open Source Community",
    "security_warning": "DO NOT COMMIT SECRETS OR API KEYS"
  },
  "external_repos": [
    {
      "label": "Awesome Copilot",
      "url": "https://github.com/github/awesome-copilot",
      "icon": "Github"
    },
    {
      "label": "Anthropic Prompt Library",
      "url": "https://docs.anthropic.com/claude/prompt-library",
      "icon": "ExternalLink"
    }
  ],
  "items": [
    {
      "id": "CP-001",
      "title": "Unit Test Generation",
      "tool": "GitHub Copilot",
      "category": "Utility",
      "tags": ["Testing", "Python", "Quality"],
      "content": "/tests Write a comprehensive pytest suite for the selected class. Include happy paths, edge cases (null/empty inputs), and mock external network calls."
    },
    {
      "id": "CL-042",
      "title": "System Architect Persona",
      "tool": "Claude 3.5",
      "category": "Persona",
      "tags": ["Architecture", "Review"],
      "content": "Act as a Principal Software Architect. Review the following code for: 1. Scalability bottlenecks, 2. Security flaws (OWASP), 3. Maintainability. Output as a markdown checklist."
    },
    {
      "id": "GM-101",
      "title": "Documentation Simplifier",
      "tool": "Gemini",
      "category": "Utility",
      "tags": ["Docs", "Writing"],
      "content": "Rewrite this technical documentation to be understood by a non-technical Product Manager. Remove jargon and use analogies."
    }
  ]
};

// --- COMPONENTS ---

const IconMap = ({ name, size = 16, className = "" }: { name: string, size?: number, className?: string }) => {
    switch (name) {
        case 'Github': return <Github size={size} className={className} />;
        case 'ExternalLink': return <ExternalLink size={size} className={className} />;
        default: return <ExternalLink size={size} className={className} />;
    }
};

const Sidebar = ({ activeFilter, setActiveFilter, externalRepos, className = "", onClose }: { activeFilter: string, setActiveFilter: (f: string) => void, externalRepos: any[], className?: string, onClose?: () => void }) => {
    const tools = ['All', ...Array.from(new Set(INITIAL_STATE.items.map(item => item.tool)))];

    return (
        <aside className={`w-64 border-r-2 border-black flex flex-col h-full bg-white ${className}`}>
            <div className="p-6 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                <div className="border-2 border-black p-3 text-center shadow-[4px_4px_0px_#000] bg-white w-full">
                    <h1 className="font-black text-2xl tracking-tighter leading-none glitch-hover cursor-default">BLIP</h1>
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
                    <h3 className="font-mono text-xs font-bold text-gray-400 mb-3 tracking-wider">FILTERS</h3>
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
                                {tool.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t-2 border-black bg-gray-50">
                <h3 className="font-mono text-xs font-bold text-gray-400 mb-3 tracking-wider">EXTERNAL_LINKS</h3>
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
                </div>
            </div>
        </aside>
    );
};

const DataCard = ({ item, onClick }: { item: any, onClick: () => void }) => {
    return (
        <div 
            onClick={onClick}
            className="group border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#CCFF00] hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col relative"
        >
            <div className="absolute top-3 right-3 border border-black px-1.5 py-0.5 bg-white text-[10px] font-mono group-hover:bg-black group-hover:text-white transition-colors">
                {item.id}
            </div>
            
            <div className="mb-4 mt-1">
                <span className="inline-block bg-black text-white text-[10px] px-2 py-0.5 font-mono mb-2 uppercase tracking-wide">
                    {item.tool}
                </span>
                <h3 className="font-bold text-xl leading-tight mb-2 group-hover:text-gray-700">{item.title}</h3>
                <div className="flex gap-1 flex-wrap">
                    {item.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1">#{tag}</span>
                    ))}
                </div>
            </div>

            <p className="font-mono text-xs text-gray-600 line-clamp-3 bg-gray-50 p-3 border border-gray-200 flex-1 group-hover:border-black transition-colors">
                {item.content}
            </p>
        </div>
    );
};

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

const DetailModal = ({ item, onClose, onCopy }: { item: any, onClose: () => void, onCopy: (msg: string) => void }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(item.content);
        onCopy("PAYLOAD_COPIED_TO_CLIPBOARD");
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
                        COPY PAYLOAD
                    </button>
                </div>
            </div>
        </div>
    );
};

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
    return (
        <div className="min-h-screen bg-black text-[#CCFF00] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(204, 255, 0, .3) 25%, rgba(204, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(204, 255, 0, .3) 75%, rgba(204, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(204, 255, 0, .3) 25%, rgba(204, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(204, 255, 0, .3) 75%, rgba(204, 255, 0, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}>
            </div>
            
            <div className="z-10 text-center max-w-2xl">
                <div className="mb-8 border-2 border-[#CCFF00] p-8 shadow-[0_0_20px_rgba(204,255,0,0.3)] bg-black/80 backdrop-blur-sm">
                    <h1 className="text-6xl font-black mb-2 tracking-tighter glitch-hover">BLIP</h1>
                    <p className="text-xl mb-6 tracking-widest">BORING LIST [OF] INTELLIGENT PROMPTS</p>
                    <div className="h-px bg-[#CCFF00] w-full mb-6"></div>
                    <p className="mb-8 text-sm leading-relaxed">
                        &gt; WELCOME TO THE BORING LIST OF INTELLIGENT PROMPTS.<br/>
                        &gt; WHERE EXCITEMENT GOES TO DIE, AND EFFICIENCY IS BORN.<br/>
                        &gt; PREPARE YOURSELF FOR SOME SERIOUSLY MUNDANE BRILLIANCE.
                    </p>
                    <button 
                        onClick={onEnter}
                        className="group relative px-8 py-4 bg-[#CCFF00] text-black font-bold text-lg hover:bg-white transition-colors w-full sm:w-auto"
                    >
                        <span className="flex items-center justify-center gap-2">
                            EXPLORE_BORING_PROMPTS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
                <p className="text-[10px] opacity-50">v{INITIAL_STATE.meta.version} // SECURE_CONNECTION_ESTABLISHED</p>
            </div>
        </div>
    );
};

function App() {
    const [view, setView] = useState<'landing' | 'app'>('landing');
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredItems = INITIAL_STATE.items.filter(item => {
        const matchesFilter = activeFilter === 'All' || item.tool === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                if (selectedItem) setSelectedItem(null);
                else if (document.activeElement === searchInputRef.current) searchInputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem]);

    const handleSurpriseMe = () => {
        const items = INITIAL_STATE.items;
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setSelectedItem(randomItem);
    };

    if (view === 'landing') {
        return <LandingPage onEnter={() => setView('app')} />;
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#CCFF00] selection:text-black scanlines">
            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar 
                    activeFilter={activeFilter} 
                    setActiveFilter={setActiveFilter} 
                    externalRepos={INITIAL_STATE.external_repos}
                    onClose={() => setIsMobileMenuOpen(false)}
                    className="h-full shadow-2xl"
                />
            </div>

            {/* Desktop Sidebar */}
            <Sidebar 
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
                externalRepos={INITIAL_STATE.external_repos} 
                className="hidden md:flex fixed left-0 top-0 h-screen z-20"
            />

            <main className="md:ml-64 min-h-screen flex flex-col relative transition-all duration-300">
                {/* Header */}
                <header className="border-b-2 border-black p-4 md:p-6 bg-white sticky top-0 z-10 flex gap-4 items-center justify-between">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 border-2 border-black hover:bg-black hover:text-[#CCFF00] transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="relative flex-1 max-w-3xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            ref={searchInputRef}
                            type="text"
                            placeholder="SEARCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 md:py-4 border-2 border-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_#CCFF00] transition-shadow placeholder:text-gray-300 bg-white"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 font-mono text-[10px] font-medium text-gray-500">
                                <Command size={10} />K
                            </kbd>
                        </div>
                    </div>

                    <button 
                        onClick={handleSurpriseMe}
                        className="hidden sm:flex items-center gap-2 px-5 py-4 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_#000] bg-white hover:bg-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all whitespace-nowrap"
                    >
                        <Shuffle size={18} />
                        SURPRISE ME
                    </button>
                    <button 
                        onClick={handleSurpriseMe}
                        className="sm:hidden p-3 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_#000] bg-white hover:bg-[#CCFF00] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <Shuffle size={20} />
                    </button>
                </header>

                {/* Status Bar */}
                <div className="bg-black text-[#CCFF00] px-4 md:px-6 py-2 font-mono text-[10px] tracking-wider flex justify-between items-center border-b-2 border-black overflow-x-auto">
                    <div className="flex gap-6 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                            ONLINE
                        </span>
                        <span className="hidden sm:inline">SOURCE: PUBLIC</span>
                        <span>v{INITIAL_STATE.meta.version}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white whitespace-nowrap ml-4">
                        <ShieldAlert size={12} />
                        <span className="hidden sm:inline">SECRETS: 0</span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 p-4 md:p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                            {filteredItems.map(item => (
                                <DataCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => setSelectedItem(item)} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 text-gray-400 font-mono rounded-lg">
                            <Terminal size={64} className="mb-6 opacity-20" />
                            <p className="text-lg">NO_DATA_FOUND</p>
                            <p className="text-xs mt-2">TRY_ADJUSTING_FILTERS</p>
                        </div>
                    )}
                </div>
            </main>

            {selectedItem && (
                <DetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    onCopy={(msg) => setToastMessage(msg)}
                />
            )}

            {toastMessage && (
                <Toast 
                    message={toastMessage} 
                    onClose={() => setToastMessage(null)} 
                />
            )}
        </div>
    );
}

export default App;
