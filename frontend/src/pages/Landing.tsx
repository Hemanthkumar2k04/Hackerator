import { Navbar } from '@/components/Navbar';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import { useNavigate } from 'react-router-dom';
import LiquidChrome from '@/components/LiquidChrome';
import { motion } from 'framer-motion';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { 
  Brain, 
  Zap, 
  Layers, 
  Target, 
  Rocket, 
  Code, 
  ChevronRight, 
  Github, 
  Twitter,
  CheckCircle2,
  Timer,
  Trophy
} from 'lucide-react';

const StepCard = ({ number, title, description, isLast }: { number: string, title: string, description: string, isLast?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    whileHover={{color: "#1a78eb"}}
    transition={{duration: 0.1}}
    viewport={{ once: true }}
    className="relative flex gap-8 items-start group cursor-pointer"
  >
    {/* Line connecting to next step */}
    {!isLast && (
      <div className="absolute left-6 top-12 bottom-0 w-px bg-neutral-800 group-hover:bg-neutral-700 transition-colors" />
    )}
    
    <motion.div 
      whileHover={{ color: "#1a78eb" }}
      transition={{ duration: 0.1 }}
      className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xl text-white group-hover:border-neutral-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
    >
      {number}
    </motion.div>
    
    <div className="pt-2 pb-12">
      <motion.h3 
        whileHover={{ color: "#1a78eb" }}
        transition={{ duration: 0.1 }}
        className="text-2xl font-bold mb-3 text-white"
      >
        {title}
      </motion.h3>
      <p className="text-neutral-300 text-lg leading-relaxed max-w-xl">{description}</p>
    </div>
  </motion.div>
);

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Architecture",
      description: "Get a complete system design tailored to your specific domain and requirements.",
      link: "#",
      icon: <Brain className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Hackathon Mode",
      description: "Optimized paths for speed. Skip the boilerplate, focus on the demo-able features.",
      link: "#",
      icon: <Zap className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Tech Stack",
      description: "Curated library recommendations that work well together. No more dependency hell.",
      link: "#",
      icon: <Layers className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Step-by-Step",
      description: "Clear execution plan. Know exactly what to build first, second, and last.",
      link: "#",
      icon: <Target className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Boilerplate Code",
      description: "Start with a solid foundation. We generate the initial folder structure for you.",
      link: "#",
      icon: <Code className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Deployment Ready",
      description: "Infrastructure as code and deployment guides included in your plan.",
      link: "#",
      icon: <Rocket className="w-8 h-8 text-cyan-400" />
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-orange-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <LiquidChrome
            baseColor={[0, 0.1, 0.1]}
            speed={0.3}
            amplitude={0.39}
            interactive={false}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen h-auto justify-start">
        <Navbar variant="public" />
        
        <main className="flex flex-col items-center w-full">
          
          {/* Hero Section */}
          <section className="w-full max-w-6xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center w-full mb-8"
            >
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
                Stop overthinking architecture. Start building. <br/>
                <span className="text-white">AI-powered roadmaps for serious projects and winning hackathons.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <button 
                  onClick={() => navigate('/auth')}
                  className="group relative px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-all flex items-center gap-2"
                >
                  Start Building
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 rounded-xl bg-neutral-900/50 text-white font-bold text-lg border border-neutral-800 hover:bg-neutral-800 transition-colors backdrop-blur-sm"
                >
                  View Examples
                </button>
              </div>
            </motion.div>

            {/* Stats / Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20 border-t border-neutral-800 pt-10"
            >
              {[
                { label: "Projects Generated", value: "10k+" },
                { label: "Hackathons Won", value: "500+" },
                { label: "Time Saved", value: "1000h+" },
                { label: "Active Users", value: "2k+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                  <span className="text-sm text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Features Grid */}
          <section className="w-full bg-black/50 backdrop-blur-sm border-y border-neutral-900 py-24">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to ship</h2>
                <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
                  From initial spark to deployment, we provide the structure you need to succeed.
                </p>
              </div>

              <div className="w-full">
                <HoverEffect items={features} />
              </div>
            </div>
          </section>

          {/* Modes Section */}
          <section className="w-full py-24 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-64 h-64" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-6">
                      <Timer className="w-4 h-4" />
                      Hackathon Mode
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Build to Win</h3>
                    <p className="text-neutral-300 mb-8 text-lg">
                      Perfect for 24-48h sprints. We prioritize visual impact and core functionality over edge-cases.
                    </p>
                    <ul className="space-y-4 mb-8">
                      {['MVP-focused roadmap', 'Rapid prototyping tools', 'Demo-day checklist', 'Pitch deck outline'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-neutral-200">
                          <CheckCircle2 className="w-5 h-5 text-orange-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate('/auth')} className="text-orange-500 font-bold hover:text-orange-400 transition-colors flex items-center gap-2">
                      Start Hackathon Project <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Rocket className="w-64 h-64" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6">
                      <Layers className="w-4 h-4" />
                      Project Mode
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Build to Scale</h3>
                    <p className="text-neutral-300 mb-8 text-lg">
                      For long-term projects. We focus on clean architecture, testing, and scalability from day one.
                    </p>
                    <ul className="space-y-4 mb-8">
                      {['Scalable Architecture', 'Testing Strategy', 'CI/CD Pipeline', 'Security Best Practices'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-neutral-200">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate('/auth')} className="text-blue-500 font-bold hover:text-blue-400 transition-colors flex items-center gap-2">
                      Start Complete Project <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="w-full py-24 bg-black/50 backdrop-blur-sm border-y border-neutral-900">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
                <p className="text-neutral-300">From idea to execution in minutes</p>
              </div>
              
              <div className="space-y-0">
                <StepCard 
                  number="1"
                  title="Choose your mode"
                  description="Select Hackathon mode for speed or Project mode for stability and scale."
                />
                <StepCard 
                  number="2"
                  title="Describe your idea"
                  description="Tell us what you want to build. Be as vague or specific as you like. Our AI understands context."
                />
                <StepCard 
                  number="3"
                  title="Get your blueprint"
                  description="Receive a comprehensive plan, folder structure, and tech stack recommendations."
                />
                <StepCard 
                  number="4"
                  title="Start coding"
                  description="Follow the step-by-step guide and check off tasks as you complete them."
                  isLast
                />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full py-32 px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 p-12 rounded-3xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to build something amazing?</h2>
              <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                Join thousands of developers who are shipping faster with Hackerator.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-lg shadow-white/10"
              >
                Get Started for Free
              </button>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="w-full py-12 border-t border-neutral-900 bg-black text-neutral-400 text-sm">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">H</div>
                <span className="font-semibold text-white">Hackerator</span>
              </div>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div className="text-center mt-8">
              © 2025 Hackerator. All rights reserved.
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
