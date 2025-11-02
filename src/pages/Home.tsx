import { motion } from 'framer-motion';
import { InputArea } from '../components/InputArea.tsx';
import { useState } from 'react';

interface HomeProps {
    onNavigate: (page: string) => void;
    selectedModel: string;
    onModelChange: (model: string) => void;
}

export function HomePage({ onNavigate, selectedModel, onModelChange }: HomeProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleComplete = () => {
        // Navigate to Team Setup or Workspace
        onNavigate('team-setup');
    };

    return (
        <div className="min-h-screen bg-surface-dark pt-20">
            {/* Grid background */}
            <div className="grid-background" />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        Welcome back
                    </h1>
                    <p className="text-secondary text-lg">
                        Create a new idea or continue with your existing projects
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main input area - takes 2 columns */}
                    <motion.div
                        initial={{ opacity: 0, height: "5px" }}
                        animate={{ opacity: 1, height: "600px" }}
                        transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                        className="lg:col-span-2 overflow-hidden"
                    >
                        <InputArea
                            isLoading={isLoading}
                            onLoadingChange={setIsLoading}
                            onComplete={handleComplete}
                            selectedModel={selectedModel}
                            onModelChange={onModelChange}
                        />
                    </motion.div>

                    {/* Sidebar with quick actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Recent ideas */}
                        <div className="bg-surface-darker rounded-lg p-6 border border-border-subtle">
                            <h3 className="text-lg font-bold text-primary mb-4">Recent Ideas</h3>
                            <div className="space-y-2 text-sm text-secondary">
                                <p>No recent ideas yet</p>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-surface-darker rounded-lg p-6 border border-border-subtle">
                            <h3 className="text-lg font-bold text-accent-primary mb-4">💡 Pro Tips</h3>
                            <ul className="space-y-2 text-sm text-secondary">
                                <li>• Be specific about your idea</li>
                                <li>• Include problem & solution</li>
                                <li>• Add an image for context</li>
                                <li>• AI will suggest next steps</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
