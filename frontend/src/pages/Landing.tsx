import { Navbar } from '@/components/Navbar';
import { WorkInProgressCard } from '@/components/WorkInProgressCard';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import { useNavigate } from 'react-router-dom';
import { GridScan } from '@/components/GridScan';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen h-auto justify-start">
      <Navbar variant="public" />
      <main className="flex flex-col items-center px-4 pt-20 pb-24 w-full">
        
        <div className="w-full max-w-6xl mx-auto text-center mb-24 mt-10">
          <div className="flex flex-row items-center justify-center w-full mb-8">
            <div className="flex justify-end w-[80%] pr-3">
              <span className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-6xl text-right whitespace-nowrap">
                Ideas → Blueprints →
              </span>
            </div>
            <div className="flex justify-start w-[40%] pl-3">
              <LayoutTextFlip 
                text=""
                words={["Reality", "MVPs", "Projects", "Products", "Solutions", "Prototypes"]}
                className="text-4xl md:text-6xl"
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            AI-powered plans that help you build complete projects or fast MVPs with confidence.
          </p>

          <div className="mb-12">
            <h3 className="text-lg font-semibold text-neutral-400 uppercase tracking-wider mb-6">
              Two modes. Infinite possibilities.
            </h3>
            <div className="flex flex-col md:flex-row w-fit mx-auto justify-center gap-8 md:gap-12 py-6 px-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">Project Mode</span>
                <span className="text-neutral-400">for end-to-end builds</span>
              </div>
              <div className="hidden md:block w-px bg-neutral-800 h-12"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-orange-500">Hackathon Mode</span>
                <span className="text-neutral-400">for rapid prototypes</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 rounded-xl bg-neutral-900 text-orange-500 font-bold text-lg border border-orange-500 hover:bg-orange-950/30 transition-colors"
            >
              Try Hackathon Mode
            </button>
          </div>
        </div>

        <WorkInProgressCard />
      </main>
      </div>
    </div>
  );
}
