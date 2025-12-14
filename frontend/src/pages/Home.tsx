import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Beams from '@/components/Beams';
import { ProjectPlanCardStack } from '@/components/ProjectPlanCardStack';
import Ai01 from '@/components/ai-01';
import Loader from '@/components/kokonutui/loader';
import { WorkInProgressCard } from '@/components/WorkInProgressCard';
import { authClient } from '@/lib/auth-client';

interface ProjectPlan {
  project_title: string;
  short_summary: string;
  problem_statement: string;
  key_features: string[];
  target_users: string[];
  team_size: number;
  tech_stack: {
    [key: string]: string[];
  };
  architecture_overview: string;
  estimated_timeline: string;
  notes: string;
}

interface SavedProject {
  id: number;
  user_id: string;
  project_title: string;
  short_summary?: string;
  mode: 'project' | 'hackathon';
  team_size: number;
  created_at: string;
  updated_at: string;
}



export function HomePage() {
  const [activeMode, setActiveMode] = useState<'project' | 'hackathon' | null>(null);
  const navigate = useNavigate();
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { data: session } = authClient.useSession();
  const [recentProjects, setRecentProjects] = useState<SavedProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      if (!session?.user?.id) {
        setLoadingProjects(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/projects', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setRecentProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchRecentProjects();
  }, [session?.user?.id]);

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
        const response = await fetch('http://localhost:4000/api/ideas/generate', {
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
    if (!projectPlan || !session?.user?.id) {
      toast.error("User session not available", {
        description: "Please sign in to save your project.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/projects/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...projectPlan,
          user_id: session.user.id,
          mode: activeMode,
          team_size: projectPlan.team_size,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const data = await response.json();
      toast.success("Project saved successfully!");
      navigate(`/workspace/${data.project_id}`);
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
        
    opacity={0.3}
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
                {loadingProjects ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader size="md" title="" subtitle="" className="!gap-0 !p-0" />
                  </div>
                ) : recentProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => navigate(`/workspace/${project.id}`)}
                        className="p-6 rounded-xl border border-neutral-800 bg-black shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-neutral-700 group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg mb-2 text-white flex-1 group-hover:text-neutral-200 transition-colors">
                            {project.project_title}
                          </h4>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2",
                            project.mode === 'hackathon' 
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          )}>
                            {project.mode === 'hackathon' ? 'Hackathon' : 'Project'}
                          </span>
                        </div>
                        {project.short_summary && (
                          <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                            {project.short_summary}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>{project.team_size} {project.team_size === 1 ? 'person' : 'people'}</span>
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-400">No projects yet. Create your first project to get started!</p>
                  </div>
                )}
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
                            <Loader 
                              title="Generating your project plan..."
                              subtitle="Our AI is analyzing your idea and creating a comprehensive roadmap"
                              size="md"
                            />
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
                <div className="w-full flex flex-col items-center justify-center py-8">
                  <WorkInProgressCard />
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
