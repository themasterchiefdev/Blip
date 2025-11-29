import { ArrowRight } from 'lucide-react';
import { APP_META } from '../constants';

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
                <p className="text-[10px] opacity-50">v{APP_META.version} // SECURE_CONNECTION_ESTABLISHED</p>
            </div>
        </div>
    );
};

export default LandingPage;
