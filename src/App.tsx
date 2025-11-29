import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Terminal, Shuffle, Command, Menu } from 'lucide-react';

// --- DATA SOURCE ---
import prompts from './data/prompts.json';

// --- CONSTANTS ---
import { EXTERNAL_REPOS, CAT_MESSAGES, CONSOLE_ART, KONAMI_CODE } from './constants';

// --- COMPONENTS ---
import Sidebar from './components/Sidebar';
import DataCard from './components/DataCard';
import Toast from './components/Toast';
import DetailModal from './components/DetailModal';
import LandingPage from './components/LandingPage';

const App = () => {
    const [view, setView] = useState<'landing' | 'app'>('landing');
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMac, setIsMac] = useState(false);
    const [logoClicks, setLogoClicks] = useState(0);
    const [statusText, setStatusText] = useState("SYSTEM: MOSTLY_HARMLESS");
    const [konamiIndex, setKonamiIndex] = useState(0);
    const [isInverted, setIsInverted] = useState(false);
    const [xp, setXp] = useState(0);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [coffeeStatus, setCoffeeStatus] = useState<'CRITICAL' | 'OPTIMAL'>('CRITICAL');
    
    // Network State - Loaded from static JSON
    const [items] = useState<any[]>(prompts);

    const searchInputRef = useRef<HTMLInputElement>(null);
    
    const unlockBadge = (badge: string) => {
        if (!unlockedBadges.includes(badge)) {
            setUnlockedBadges(prev => [...prev, badge]);
            setToastMessage(`ACHIEVEMENT UNLOCKED: ${badge}`);
        }
    };

    // Console Art
    useEffect(() => {
        console.log(CONSOLE_ART);
    }, []);

    // ... (Easter Egg Logic)

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
    };

    // Easter Egg Logic
    const isCatSearch = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        const isCat = q === 'cat' || q === 'cats' || q.includes('cat video');
        if (isCat) unlockBadge('CURIOSITY_KILLED_THE_CAT');
        return isCat;
    }, [searchQuery]);

    const specialSearchMessage = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (q === 'recursion') return "DID YOU MEAN: RECURSION?";
        if (q === 'sudo') return "USER_NOT_IN_SUDOERS_FILE. INCIDENT_REPORTED.";
        if (q === '42') return "ANSWER_FOUND. QUESTION_MISSING.";
        if (q === 'rm -rf') return "NICE TRY. I HAVE BACKUPS.";
        return null;
    }, [searchQuery]);

    const catMessage = useMemo(() => {
        return CAT_MESSAGES[Math.floor(Math.random() * CAT_MESSAGES.length)];
    }, [isCatSearch]); 

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    // Konami Code
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === KONAMI_CODE[konamiIndex]) {
                const nextIndex = konamiIndex + 1;
                if (nextIndex === KONAMI_CODE.length) {
                    setIsInverted(true);
                    setToastMessage("CHEAT_CODE_ACTIVATED: GOD_MODE_ENABLED");
                    unlockBadge('KONAMI_MASTER');
                    setTimeout(() => setIsInverted(false), 5000);
                    setKonamiIndex(0);
                } else {
                    setKonamiIndex(nextIndex);
                }
            } else {
                setKonamiIndex(0);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [konamiIndex]);

    const handleLogoClick = () => {
        const newClicks = logoClicks + 1;
        setLogoClicks(newClicks);
        if (newClicks === 5) {
            setToastMessage("OUCH! STOP POKING ME.");
            unlockBadge('RAGE_QUIT');
            setLogoClicks(0);
        }
    };

    const handleStatusClick = () => {
        const statuses = [
            "SYSTEM: MOSTLY_HARMLESS",
            "SYSTEM: BARELY_HOLDING_TOGETHER",
            "SYSTEM: OUT_TO_LUNCH",
            "SYSTEM: PRETENDING_TO_WORK",
            "SYSTEM: RUNNING_ON_HOPES_AND_DREAMS"
        ];
        const currentIndex = statuses.indexOf(statusText);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setStatusText(statuses[nextIndex]);
    };

    const allItems = items;

    const filteredItems = allItems.filter(item => {
        const matchesFilter = activeFilter === 'All' || item.tool === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
        const items = allItems;
        const randomItem = items[Math.floor(Math.random() * items.length)];
        handleItemClick(randomItem);
    };

    const handleCoffeeClick = () => {
        setCoffeeStatus(prev => prev === 'CRITICAL' ? 'OPTIMAL' : 'CRITICAL');
    };

    if (view === 'landing') {
        return <LandingPage onEnter={() => setView('app')} />;
    }

    return (
        <div className={`min-h-screen bg-white text-black font-sans selection:bg-[#CCFF00] selection:text-black scanlines ${isInverted ? 'invert' : ''}`}>
            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar 
                    activeFilter={activeFilter} 
                    setActiveFilter={setActiveFilter} 
                    externalRepos={EXTERNAL_REPOS}
                    onClose={() => setIsMobileMenuOpen(false)}
                    onCoffeeClick={handleCoffeeClick}
                    onLogoClick={handleLogoClick}
                    coffeeStatus={coffeeStatus}
                    xp={xp}
                    className="h-full shadow-2xl"
                />
            </div>

            {/* Desktop Sidebar */}
            <Sidebar 
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
                externalRepos={EXTERNAL_REPOS} 
                onCoffeeClick={handleCoffeeClick}
                onLogoClick={handleLogoClick}
                coffeeStatus={coffeeStatus}
                xp={xp}
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
                            placeholder="SEARCH_FOR_ANSWERS_OR_CAT_VIDEOS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 md:py-4 border-2 border-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_#CCFF00] transition-shadow placeholder:text-gray-300 bg-white"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 font-mono text-[10px] font-medium text-gray-500">
                                {isMac ? <Command size={10} /> : <span className="text-[10px] font-bold">CTRL</span>} K
                            </kbd>
                        </div>
                    </div>

                    <button 
                        onClick={handleSurpriseMe}
                        className="hidden sm:flex items-center gap-2 px-5 py-4 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_#000] bg-white hover:bg-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all whitespace-nowrap"
                    >
                        <Shuffle size={18} />
                        I'M FEELING LAZY
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
                        <span 
                            className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors"
                            onClick={handleStatusClick}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                            {statusText}
                        </span>
                        <span className="hidden sm:inline">SOURCE: TRUST_ME_BRO</span>
                        <span 
                            className="cursor-pointer hover:text-white transition-colors"
                            onClick={() => setToastMessage("RELEASE_DATE: WHEN_IT_IS_READY")}
                        >
                            v1.2 (BETA_FOREVER)
                        </span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 p-4 md:p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                    {isCatSearch ? (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-black bg-yellow-50 text-black font-mono rounded-lg p-8 text-center shadow-[8px_8px_0px_#000] animate-in zoom-in-95 duration-300">
                            <div className="text-6xl mb-4">😿</div>
                            <h2 className="text-2xl font-black mb-2">ACCESS_DENIED</h2>
                            <p className="text-lg font-bold">{catMessage}</p>
                            <p className="text-xs mt-6 text-gray-500">INCIDENT_REPORTED_TO_HR</p>
                        </div>
                    ) : specialSearchMessage ? (
                         <div className="flex flex-col items-center justify-center h-96 border-2 border-black bg-black text-[#CCFF00] font-mono rounded-lg p-8 text-center shadow-[8px_8px_0px_#CCFF00] animate-in zoom-in-95 duration-300">
                            <Terminal size={64} className="mb-6" />
                            <h2 className="text-2xl font-black mb-2">SYSTEM_MESSAGE</h2>
                            <p className="text-lg font-bold">{specialSearchMessage}</p>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                            {filteredItems.map(item => (
                                <DataCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => handleItemClick(item)} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 text-gray-400 font-mono rounded-lg">
                            <Terminal size={64} className="mb-6 opacity-20" />
                            <p className="text-lg">404: MOTIVATION_NOT_FOUND</p>
                            <p className="text-xs mt-2">HAVE_YOU_TRIED_TURNING_IT_OFF_AND_ON_AGAIN?</p>
                        </div>
                    )}
                </div>
            </main>

            {selectedItem && (
                <DetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    onCopy={(msg) => {
                        setToastMessage(msg);
                        setXp(prev => prev + 10);
                        unlockBadge('FIRST_BLOOD');
                    }}
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
