import './App.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './pages/Landing.tsx';
import { HomePage } from './pages/Home.tsx';
import { TeamSetupModal } from './components/TeamSetupModal.tsx';
import type { IntermediateIdea, TeamInfo } from './types/index.ts';
import { Workspace } from './pages/Workspace.tsx';

type Page = 'landing' | 'home' | 'workspace' | 'test';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<IntermediateIdea | null>(null);
  const [showTeamSetup, setShowTeamSetup] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleSignIn = () => {
    setIsSignedIn(true);
    setCurrentPage('home');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleIdeaComplete = (idea: IntermediateIdea) => {
    setCurrentIdea(idea);
    setShowTeamSetup(true);
  };

  const handleTeamSetupComplete = (teamInfo: TeamInfo) => {
    // TODO: Save to Supabase and navigate to workspace
    console.log('Team setup complete:', teamInfo);
    setShowTeamSetup(false);
    setCurrentPage('workspace');
  };

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar
        isSignedIn={isSignedIn}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />

      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onSignIn={handleSignIn}
              onProceed={() => handleIdeaComplete(
                // Placeholder - would get from InputArea
                {
                  idea_title: 'Placeholder',
                  idea_summary: 'Placeholder',
                  unique_selling_point: 'Placeholder',
                }
              )}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </motion.div>
        )}

        {currentPage === 'home' && isSignedIn && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage
              onNavigate={handleNavigate}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </motion.div>
        )}

        {currentPage === 'workspace' && isSignedIn && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Workspace />
          </motion.div>
        )}

        {currentPage === 'workspace' && !isSignedIn && (
          <motion.div
            key="unauthorized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-20 text-center"
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
              <h2 className="text-2xl font-bold text-text-primary">Sign In Required</h2>
              <p className="text-text-muted">Please sign in to access the workspace</p>
              <button
                onClick={handleSignIn}
                className="px-6 py-2 bg-accent-primary text-dark rounded hover:bg-accent-secondary transition"
              >
                Sign In Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Setup Modal */}
      {showTeamSetup && currentIdea && (
        <TeamSetupModal
          idea={currentIdea}
          model={selectedModel}
          onComplete={handleTeamSetupComplete}
          onCancel={() => setShowTeamSetup(false)}
        />
      )}
    </div>
  );
}

export default App;
