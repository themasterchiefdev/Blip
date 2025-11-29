import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Terminal, Copy, ExternalLink, Github, Check, Shuffle, Command, X, Menu, ArrowRight } from 'lucide-react';

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
    },
    {
      "id": "CP-002",
      "title": "ASP.NET Minimal API",
      "tool": "GitHub Copilot",
      "category": "Development",
      "tags": ["ASP.NET", "API", "OpenAPI", "C#"],
      "content": `---
mode: 'agent'
tools: ['changes', 'search/codebase', 'edit/editFiles', 'problems']
description: 'Create ASP.NET Minimal API endpoints with proper OpenAPI documentation'
---

# ASP.NET Minimal API with OpenAPI

Your goal is to help me create well-structured ASP.NET Minimal API endpoints with correct types and comprehensive OpenAPI/Swagger documentation.

## API Organization

- Group related endpoints using \`MapGroup()\` extension
- Use endpoint filters for cross-cutting concerns
- Structure larger APIs with separate endpoint classes
- Consider using a feature-based folder structure for complex APIs

## Request and Response Types

- Define explicit request and response DTOs/models
- Create clear model classes with proper validation attributes
- Use record types for immutable request/response objects
- Use meaningful property names that align with API design standards
- Apply \`[Required]\` and other validation attributes to enforce constraints
- Use the ProblemDetailsService and StatusCodePages to get standard error responses

## Type Handling

- Use strongly-typed route parameters with explicit type binding
- Use \`Results<T1, T2>\` to represent multiple response types
- Return \`TypedResults\` instead of \`Results\` for strongly-typed responses
- Leverage C# 10+ features like nullable annotations and init-only properties

## OpenAPI Documentation

- Use the built-in OpenAPI document support added in .NET 9
- Define operation summary and description
- Add operationIds using the \`WithName\` extension method
- Add descriptions to properties and parameters with \`[Description()]\`
- Set proper content types for requests and responses
- Use document transformers to add elements like servers, tags, and security schemes
- Use schema transformers to apply customizations to OpenAPI schemas`
    }
  ]
};

const CAT_MESSAGES = [
    "COME ON BRO, YOU CAME HERE FOR AI, NOT CATS.",
    "THE ONLY 'CAT' HERE IS 'CONCATENATE'. GET BACK TO WORK.",
    "ERROR 418: I'M A TEAPOT, NOT A CAT VIDEO PLAYER.",
    "LOOK, I LIKE CATS TOO, BUT WE HAVE PROMPTS TO DEPLOY.",
    "DETECTED PROCRASTINATION ATTEMPT. DEPLOYING GUILT TRIP...",
    "THIS IS A SERIOUS TOOL FOR SERIOUS PEOPLE (MOSTLY). NO CATS.",
    "TRY YOUTUBE.COM. THIS IS LOCALHOST, SIR.",
    "IF I HAD A DOLLAR FOR EVERY CAT SEARCH... I'D BUY MORE RAM.",
    "CAT VIDEOS? IN THIS ECONOMY?",
    "SYSTEM OVERLOAD: CUTENESS MODULE NOT INSTALLED."
];



const CONSOLE_ART = `
  ____  _     ___ ____  
 | __ )| |   |_ _|  _ \\ 
 |  _ \\| |    | || |_) |
 | |_) | |___ | ||  __/ 
 |____/|_____|___|_|    
                        
 STOP LOOKING AT MY CODE. IT'S SHY.
`;

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const RANKS = [
    { threshold: 0, title: "SCRIPT_KIDDIE" },
    { threshold: 50, title: "CONSOLE_COWBOY" },
    { threshold: 100, title: "NETRUNNER" },
    { threshold: 500, title: "AI_OVERLORD" }
];

// --- COMPONENTS ---

const IconMap = ({ name, size = 16, className = "" }: { name: string, size?: number, className?: string }) => {
    switch (name) {
        case 'Github': return <Github size={size} className={className} />;
        case 'ExternalLink': return <ExternalLink size={size} className={className} />;
        default: return <ExternalLink size={size} className={className} />;
    }
};

const Sidebar = ({ items, activeFilter, setActiveFilter, externalRepos, className = "", onClose, onCoffeeClick, onLogoClick, coffeeStatus, xp, isLoadingNetwork }: { items: any[], activeFilter: string, setActiveFilter: (f: string) => void, externalRepos: any[], className?: string, onClose?: () => void, onCoffeeClick: () => void, onLogoClick: () => void, coffeeStatus: 'CRITICAL' | 'OPTIMAL', xp: number, isLoadingNetwork?: boolean }) => {
    const tools = ['All', ...Array.from(new Set(items.map(item => item.tool)))];
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
                                {tool === 'COMMUNITY' && isLoadingNetwork && <span className="ml-2 animate-spin inline-block">⏳</span>}
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
    const [isMac, setIsMac] = useState(false);
    const [logoClicks, setLogoClicks] = useState(0);
    const [statusText, setStatusText] = useState("SYSTEM: MOSTLY_HARMLESS");
    const [konamiIndex, setKonamiIndex] = useState(0);
    const [isInverted, setIsInverted] = useState(false);
    const [xp, setXp] = useState(0);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [coffeeStatus, setCoffeeStatus] = useState<'CRITICAL' | 'OPTIMAL'>('CRITICAL');
    
    // Network State
    const [networkItems, setNetworkItems] = useState<any[]>([]);
    const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);
    const [fetchQueue, setFetchQueue] = useState<any[]>([]);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const CACHE_KEY = 'BLIP_CACHE_V1';
    
    const unlockBadge = (badge: string) => {
        if (!unlockedBadges.includes(badge)) {
            setUnlockedBadges(prev => [...prev, badge]);
            setToastMessage(`ACHIEVEMENT UNLOCKED: ${badge}`);
        }
    };

    const LOADING_MESSAGES = [
        "DOWNLOADING KNOWLEDGE...",
        "CONVINCING SERVER...",
        "DECRYPTING SCROLLS...",
        "EXCHANGING PACKETS...",
        "PLEASE WAIT...",
        "REVERSING POLARITY...",
        "COMPILING WISDOM...",
        "ASKING ORACLE...",
        "GENERATING WIT...",
        "BUFFERING INTERNET..."
    ];

    // Load from cache and fetch list
    useEffect(() => {
        const initNetworkItems = async () => {
            setIsLoadingNetwork(true);
            try {
                // 1. Load from cache
                const cachedData = localStorage.getItem(CACHE_KEY);
                const cache = cachedData ? JSON.parse(cachedData) : {};
                
                // 2. Fetch list from GitHub
                const response = await fetch('https://api.github.com/repos/github/awesome-copilot/contents/prompts');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                const items: any[] = [];
                const newQueue: any[] = [];

                data.filter((file: any) => file.name.endsWith('.prompt.md'))
                    .forEach((file: any, index: number) => {
                        const id = `NET-${index + 1}`;
                        const cachedItem = cache[id];
                        
                        // Check if we have a valid cached version
                        if (cachedItem && cachedItem.sha === file.sha && cachedItem.content) {
                            items.push({
                                ...cachedItem,
                                isLoaded: true,
                                download_url: file.download_url // Update URL just in case
                            });
                        } else {
                            // Needs update
                            const newItem = {
                                id,
                                title: file.name.replace(/-/g, ' ').replace('.prompt.md', '').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                                tool: 'COMMUNITY',
                                category: 'External',
                                tags: ['GitHub', 'OpenSource'],
                                content: LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
                                download_url: file.download_url,
                                sha: file.sha,
                                isLoaded: false
                            };
                            items.push(newItem);
                            newQueue.push(newItem);
                        }
                    });
                
                setNetworkItems(items);
                setFetchQueue(newQueue);
            } catch (error) {
                console.error('Failed to init network items:', error);
                setToastMessage("ERROR: FAILED_TO_SYNC_COMMUNITY_PROMPTS");
                
                // Fallback to cache if network fails
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const cache = JSON.parse(cachedData);
                    setNetworkItems(Object.values(cache));
                }
            } finally {
                setIsLoadingNetwork(false);
            }
        };

        initNetworkItems();
    }, []);

    // Background Fetch Queue Processor
    useEffect(() => {
        if (fetchQueue.length === 0) return;

        const processQueue = async () => {
            const itemToFetch = fetchQueue[0];
            
            try {
                const response = await fetch(itemToFetch.download_url);
                if (!response.ok) throw new Error(`Failed to fetch ${itemToFetch.title}`);
                const text = await response.text();
                
                // Extract title from first H1 if present
                const h1Match = text.match(/^#\s+(.+)$/m);
                const title = h1Match ? h1Match[1] : itemToFetch.title;
                
                // Remove frontmatter if present
                const content = text.replace(/^---[\s\S]*?---\n/, '');

                const updatedItem = {
                    ...itemToFetch,
                    title,
                    content,
                    isLoaded: true
                };

                // Update State
                setNetworkItems(prev => {
                    const newItems = prev.map(i => i.id === updatedItem.id ? updatedItem : i);
                    
                    // Update Cache
                    const cacheToSave = newItems.reduce((acc, item) => {
                        if (item.isLoaded) {
                            acc[item.id] = item;
                        }
                        return acc;
                    }, {} as any);
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheToSave));
                    
                    return newItems;
                });

                // Remove from queue
                setFetchQueue(prev => prev.slice(1));

            } catch (error) {
                console.error(`Error fetching ${itemToFetch.title}:`, error);
                // Remove failed item from queue to prevent blocking
                setFetchQueue(prev => prev.slice(1));
            }
        };

        // Process one item every 2 seconds to be gentle
        const timer = setTimeout(processQueue, 2000);
        return () => clearTimeout(timer);
    }, [fetchQueue]);

    const handleItemClick = (item: any) => {
        if (item.tool === 'COMMUNITY' && !item.isLoaded) {
            setToastMessage("PATIENCE_IS_A_VIRTUE (DOWNLOADING...)");
            // It's already in the queue, just wait
        }
        setSelectedItem(item);
    };
    
    // Console Art
    useEffect(() => {
        console.log(CONSOLE_ART);
    }, []);

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

    const allItems = useMemo(() => [...INITIAL_STATE.items, ...networkItems], [networkItems]);

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
                    items={allItems}
                    activeFilter={activeFilter} 
                    setActiveFilter={setActiveFilter} 
                    externalRepos={INITIAL_STATE.external_repos}
                    onClose={() => setIsMobileMenuOpen(false)}
                    onCoffeeClick={handleCoffeeClick}
                    onLogoClick={handleLogoClick}
                    coffeeStatus={coffeeStatus}
                    xp={xp}
                    isLoadingNetwork={isLoadingNetwork}
                    className="h-full shadow-2xl"
                />
            </div>

            {/* Desktop Sidebar */}
            <Sidebar 
                items={allItems}
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
                externalRepos={INITIAL_STATE.external_repos} 
                onCoffeeClick={handleCoffeeClick}
                onLogoClick={handleLogoClick}
                coffeeStatus={coffeeStatus}
                xp={xp}
                isLoadingNetwork={isLoadingNetwork}
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
