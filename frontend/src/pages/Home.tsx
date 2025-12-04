import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Beams from '@/components/Beams';
import { ProjectPlanCardStack } from '@/components/ProjectPlanCardStack';
import Ai01 from '@/components/ai-01';

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



export function HomePage() {
  const [activeMode, setActiveMode] = useState<'project' | 'hackathon' | null>(null);
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleCreateProject = () => {
    // In a real app, you would save the project details here
    navigate('/workspace');
  };

  const handleBack = () => {
    if (activeMode === 'project' && step === 2) {
      setStep(1);
    } else {
      setActiveMode(null);
      setStep(1);
    }
  };

  const handleIdeaSubmit = async (message: string) => {
      if (!message) return;

      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/ideas/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idea: message }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate project plan');
        }

        const data = await response.json();
        setProjectPlan(data);
        setStep(2);
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate project plan", {
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
  };

  const handleStartBuilding = async () => {
    if (!projectPlan) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectPlan),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      toast.success("Project saved successfully!");
      navigate('/workspace');
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Beams
        beamWidth={2}

    beamHeight={15}

    beamNumber={12}

    lightColor="#ffffff"

    speed={2}

    noiseIntensity={1.75}

    scale={0.2}

    rotation={45}
        />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen h-auto justify-start">
      <div className="w-full">
        <Navbar variant="auth" />
      </div>
      
      <main className="relative w-full min-h-[80vh] flex flex-col items-center justify-start pt-4">
        <AnimatePresence mode="wait">
          {!activeMode ? (
            <motion.div 
              key="selection"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full px-4 pt-10"
            >
              <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl text-white font-bold">
                What do you want to build today?
              </h2>
              
              <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-3xl">
                
                {/* Project Mode Card */}
                <div className="flex-1 flex flex-col items-center gap-6 p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-neutral-800 shadow-sm hover:shadow-md transition-all">
                  <div className="text-center space-y-2 flex-1">
                    <h3 className="text-2xl font-bold text-neutral-300">
                      Complete Project
                    </h3>
                    <p className="text-base text-neutral-400">
                      Build a complete end to end project with full features and scalability in mind.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveMode('project')}
                    className="w-full px-6 py-3 rounded-lg bg-white text-black font-medium hover:opacity-90 transition-opacity mt-auto"
                  >
                    Start Project
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[1px] bg-neutral-800 self-stretch my-4" />

                {/* Hackathon Mode Card */}
                <div className="flex-1 flex flex-col items-center gap-6 p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-neutral-800 shadow-sm hover:shadow-md transition-all">
                  <div className="text-center space-y-2 flex-1">
                    <h3 className="text-2xl font-bold text-orange-500">
                      Hackathon Mode
                    </h3>
                    <p className="text-base text-neutral-400">
                      Build with MVP focused roadmap optimized for speed and hackathons.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveMode('hackathon')}
                    className="w-full px-6 py-3 rounded-lg border-2 border-orange-500 text-orange-500 bg-neutral-900 font-medium hover:bg-orange-950/30 transition-colors mt-auto"
                  >
                    Start Hackathon project
                  </button>
                </div>
              </div>

              <div className="mt-20 w-full max-w-4xl">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">Recent Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl border border-neutral-800 bg-black shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold text-lg mb-2 text-white">Project {i}</h4>
                      <p className="text-sm text-neutral-400">
                        A brief description of the project goes here. It's a placeholder for now.
                      </p>
                      <div className="mt-4 flex items-center text-xs text-neutral-500">
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[95%] px-4 flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-start mb-4">
                <button 
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center space-y-2 mb-4">
                <h3 className={cn("text-3xl font-bold", activeMode === 'hackathon' ? "text-orange-500" : "text-neutral-200")}>
                  {activeMode === 'project' ? 'Complete Project' : 'Hackathon Mode'}
                </h3>
                <p className="text-lg text-neutral-300">
                  {activeMode === 'project' 
                    ? 'Build a complete end to end project with full features and scalability in mind.'
                    : 'Build with MVP focused roadmap optimized for speed and hackathons.'
                  }
                </p>
              </div>

              {activeMode === 'project' ? (
                <div className="w-full max-w-full flex flex-col items-center gap-8 py-4">
                   {/* Step Indicator */}
                   <div className="flex items-center gap-2 mb-4">
                      <div className={cn("h-1.5 w-12 rounded-full transition-colors duration-300", step >= 1 ? "bg-white" : "bg-neutral-800")} />
                      <div className={cn("h-1.5 w-12 rounded-full transition-colors duration-300", step >= 2 ? "bg-white" : "bg-neutral-800")} />
                   </div>

                   <AnimatePresence mode="wait">
                     {step === 1 ? (
                       <motion.div
                         key="step1"
                         initial={{ x: -20, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         exit={{ x: -20, opacity: 0 }}
                         transition={{ duration: 0.3 }}
                         className="w-full flex flex-col items-center gap-6"
                       >
                         <h3 className="text-xl md:text-2xl font-semibold text-neutral-300">
                           Let the AI help you with your idea
                         </h3>
                         
                         <div className="w-full flex flex-col items-center gap-6 px-4">
                           <div className="w-full max-w-2xl">
                             <Ai01 onSubmit={handleIdeaSubmit} />
                           </div>
                         </div>

                         {isLoading && (
                            <div className="flex justify-center mt-8">
                              <Loader2 className="w-8 h-8 animate-spin text-white" />
                            </div>
                          )}
                       </motion.div>
                     ) : (
                       projectPlan && (
                        <ProjectPlanCardStack
                          projectPlan={projectPlan}
                          setProjectPlan={setProjectPlan}
                          onComplete={handleStartBuilding}
                          isLoading={isLoading}
                        />
                       )
                     )}
                   </AnimatePresence>
                </div>
              ) : (
                <div className={cn(
                  "w-full p-8 rounded-xl shadow-sm border",
                  "bg-orange-950/10 border-orange-900/50"
                )}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-name" className="text-orange-100">
                        Project Name
                      </Label>
                      <Input 
                        id="project-name" 
                        placeholder="Hackathon Winner 2025"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border-orange-800 focus-visible:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-desc" className="text-orange-100">
                        Description (Optional)
                      </Label>
                      <Input 
                        id="project-desc" 
                        placeholder="What are you hacking?"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="border-orange-800 focus-visible:ring-orange-500"
                      />
                    </div>
                    <button 
                      onClick={handleCreateProject}
                      className="w-full px-6 py-3 rounded-lg font-medium transition-colors mt-4 bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Start Hacking
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>
    </div>
  );
}
