import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProjectPlan {
  project_title: string;
  short_summary: string;
  problem_statement: string;
  key_features: string[];
  target_users: string[];
  tech_stack: {
    [key: string]: string[];
  };
  architecture_overview: string;
  estimated_timeline: string;
  notes: string;
}

interface ProjectPlanCardStackProps {
  projectPlan: ProjectPlan;
  setProjectPlan: (plan: ProjectPlan) => void;
  onComplete: () => void;
  isLoading: boolean;
}

const techStackColors: { [key: string]: string } = {
  frontend: "border-blue-500/50 bg-blue-950/10",
  backend: "border-emerald-500/50 bg-emerald-950/10",
  database: "border-yellow-500/50 bg-yellow-950/10",
  devops: "border-purple-500/50 bg-purple-950/10",
  authentication: "border-rose-500/50 bg-rose-950/10",
  storage: "border-indigo-500/50 bg-indigo-950/10",
  APIs_and_integrations: "border-pink-500/50 bg-pink-950/10",
  testing: "border-teal-500/50 bg-teal-950/10",
  monitoring_and_logging: "border-amber-500/50 bg-amber-950/10",
  other_tools: "border-gray-500/50 bg-gray-950/10",
};

export function ProjectPlanCardStack({ projectPlan, setProjectPlan, onComplete, isLoading }: ProjectPlanCardStackProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const visibleCards = [0, 2, 3]; // Only show cards 0 (Project Basics), 2 (Tech Stack), 3 (Features)

  const handleNext = () => {
    const currentIndex = visibleCards.indexOf(page);
    if (currentIndex < visibleCards.length - 1) {
      setPage([visibleCards[currentIndex + 1], 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = visibleCards.indexOf(page);
    if (currentIndex > 0) {
      setPage([visibleCards[currentIndex - 1], -1]);
    }
  };

  const isLastCard = page === visibleCards[visibleCards.length - 1];

  const variants = {
    enter: (direction: number) => ({
      zIndex: 0,
      x: direction > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const renderCardContent = (index: number) => {
    switch (index) {
      case 0: // Project Title & Timeline
        return (
          <div className="space-y-8 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-4">Project Basics</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-neutral-400">Project Title</Label>
                <Input 
                  value={projectPlan.project_title} 
                  onChange={(e) => setProjectPlan({...projectPlan, project_title: e.target.value})}
                  className="bg-neutral-950 border-2 border-neutral-800 text-white text-xl font-bold h-14 rounded-xl focus-visible:ring-0 focus-visible:border-neutral-600 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-400">Estimated Timeline</Label>
                <Input 
                  value={projectPlan.estimated_timeline} 
                  onChange={(e) => setProjectPlan({...projectPlan, estimated_timeline: e.target.value})}
                  className="bg-neutral-950 border-2 border-neutral-800 text-white h-14 rounded-xl focus-visible:ring-0 focus-visible:border-neutral-600 transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 1: // Summary & Problem (Hidden but data preserved)
        return null;
      case 2: // Tech Stack
        return (
          <div className="space-y-6 h-full flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Tech Stack</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectPlan.tech_stack && Object.entries(projectPlan.tech_stack).map(([category, techs]) => (
                  <div
                    key={category}
                    className={cn(
                      "p-4 rounded-xl border backdrop-blur-sm",
                      techStackColors[category] || "border-neutral-800 bg-neutral-900/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                        {category.replace(/_/g, ' ')}
                      </h4>
                      <button
                        onClick={() => {
                          if (!projectPlan.tech_stack) return;
                          const newStack = { ...projectPlan.tech_stack };
                          newStack[category] = [...newStack[category], ""];
                          setProjectPlan({ ...projectPlan, tech_stack: newStack });
                        }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Plus className="w-3 h-3 text-neutral-400" />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {techs.map((tech, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-200 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                          <input
                            value={tech}
                            onChange={(e) => {
                              if (!projectPlan.tech_stack) return;
                              const newStack = { ...projectPlan.tech_stack };
                              newStack[category] = [...newStack[category]];
                              newStack[category][i] = e.target.value;
                              setProjectPlan({ ...projectPlan, tech_stack: newStack });
                            }}
                            className="flex-1 bg-transparent border-none text-neutral-200 p-0 h-auto focus:ring-0 focus:outline-none text-sm min-w-0"
                          />
                          <button
                            onClick={() => {
                              if (!projectPlan.tech_stack) return;
                              const newStack = { ...projectPlan.tech_stack };
                              newStack[category] = newStack[category].filter((_, index) => index !== i);
                              setProjectPlan({ ...projectPlan, tech_stack: newStack });
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all"
                          >
                            <X className="w-3 h-3 text-neutral-400" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3: // Key Features
        return (
          <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">Key Features</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {projectPlan.key_features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950 border-2 border-neutral-800 group hover:border-neutral-700 transition-colors"
                  >
                    <div className="mt-2 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <textarea 
                      value={feature} 
                      onChange={(e) => {
                        const newFeatures = [...projectPlan.key_features];
                        newFeatures[idx] = e.target.value;
                        setProjectPlan({...projectPlan, key_features: newFeatures});
                      }}
                      rows={1}
                      className="w-full bg-transparent border-none text-white p-0 focus:ring-0 focus:outline-none resize-none text-sm leading-relaxed min-h-[1.5rem]"
                    />
                    <button
                      onClick={() => {
                        const newFeatures = projectPlan.key_features.filter((_, i) => i !== idx);
                        setProjectPlan({...projectPlan, key_features: newFeatures});
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all shrink-0"
                    >
                      <X className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4: // Architecture & Notes (Hidden but data preserved)
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] relative flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            className="absolute top-0 left-0 w-full h-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                {page === 3 && (
                  <>
                    <button
                      onClick={() => setProjectPlan({
                        ...projectPlan,
                        key_features: [...projectPlan.key_features, ""]
                      })}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition-colors mr-2"
                    >
                      <Plus className="w-3 h-3" />
                      Add Feature
                    </button>
                    <button 
                      onClick={onComplete}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Start Building"}
                    </button>
                  </>
                )}
                <button
                  onClick={handlePrev}
                  disabled={page === visibleCards[0]}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-0 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isLastCard}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-0 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            {renderCardContent(page)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
