import { useState } from 'react';
import { motion } from 'framer-motion';
import { InputArea } from '../components/InputArea.tsx';

interface LandingProps {
    onSignIn: () => void;
    onProceed: () => void;
}

export function LandingPage({ onSignIn, onProceed }: LandingProps) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col">
            {/* Grid background */}
            <div className="grid-background" />

            {/* Navbar space */}
            <div className="h-16" />

            {/* Main content */}
            <div className="flex-1 grid grid-cols-12 gap-0">
                {/* Left column - Branding (5/12) */}
                <motion.div
                    className="col-span-12 lg:col-span-5 flex flex-col justify-center items-start px-8 lg:px-16 py-12 bg-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-6">
                        <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-4">
                            Hackerator
                        </h1>
                        <p className="text-xl text-secondary mb-2">
                            AI-Powered Hackathon Ideation & Execution
                        </p>
                    </div>

                    <div className="space-y-4 max-w-md">
                        <p className="text-secondary leading-relaxed">
                            Transform your hackathon ideas into executable plans. From brainstorm to launch in one
                            place.
                        </p>
                        <ul className="space-y-2 text-secondary text-sm">
                            <li className="flex items-center gap-2">
                                <span className="text-accent-primary">✓</span> AI-powered ideation
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-accent-primary">✓</span> Intelligent task distribution
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-accent-primary">✓</span> Team collaboration workspace
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-accent-primary">✓</span> Real-time progress tracking
                            </li>
                        </ul>
                    </div>

                    <motion.button
                        onClick={onSignIn}
                        className="mt-8 px-6 py-3 bg-accent-primary text-surface-dark font-semibold rounded-lg hover:bg-accent-secondary transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started
                    </motion.button>
                </motion.div>

                {/* Right column - Input area */}
                <motion.div
                    className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center px-8 lg:px-16 py-12"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="w-full max-w-xl">
                        <InputArea
                            isLoading={isLoading}
                            onLoadingChange={setIsLoading}
                            onComplete={onProceed}
                            showAuthPrompt
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
