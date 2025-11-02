import './App.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './pages/Landing.tsx';
import { HomePage } from './pages/Home.tsx';
import { TeamSetupModal } from './components/TeamSetupModal.tsx';
import type { IntermediateIdea, TeamInfo } from './types/index.ts';

type Page = 'landing' | 'home' | 'workspace' | 'saved' | 'test';

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

        {currentPage === 'workspace' && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-20 p-8 text-center">
              <h1 className="text-3xl font-bold text-primary mb-4">Workspace</h1>
              <p className="text-secondary">Workspace view coming soon...</p>
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
