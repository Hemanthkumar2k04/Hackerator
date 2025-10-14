import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import ThemeSquares from '../components/ThemeSquares'
import AuthModal from '../components/AuthModal'
import { useAuth } from '../contexts/AuthContext'
import Logo from '@/assets/Hackerator.svg'
export default function Landing() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
    const { user } = useAuth()
    const navigate = useNavigate()

    // If user is already logged in, redirect to home
    if (user) {
        navigate('/home')
        return null
    }

    const openAuthModal = (mode: 'signin' | 'signup') => {
        setAuthMode(mode)
        setIsAuthModalOpen(true)
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            {/* Squares Background */}
            <div className="fixed inset-0 z-0">
                <ThemeSquares />
            </div>

            {/* Landing Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 pointer-events-none">
                <div className="max-w-4xl text-center pointer-events-auto">
                    <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
                        Unleash Your Next Big Idea with{' '}
                        <span className="text-emerald-500">H</span>acker
                        <span className="text-emerald-500">R</span>ator
                        <img src={Logo} alt="Hackerator" className="inline h-36 w-auto -ml-8" />
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                        AI-powered creativity at your fingertips. Generate ideas, spark innovation, and bring your visions to life.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => openAuthModal('signup')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openAuthModal('signin')}
                            className="px-8 py-6 text-lg"
                        >
                            Sign In
                        </Button>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="light-beam-border rounded-xl bg-card/90 backdrop-blur-sm border border-border p-6">
                            <div className="mb-4 inline-block rounded-lg bg-emerald-500/18 p-3">
                                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-foreground">Instant Ideas</h3>
                            <p className="text-muted-foreground">
                                Generate creative concepts in seconds with AI-powered suggestions tailored to your needs.
                            </p>
                        </div>

                        <div className="light-beam-border rounded-xl bg-card/90 backdrop-blur-sm border border-border p-6">
                            <div className="mb-4 inline-block rounded-lg bg-emerald-500/18 p-3">
                                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-foreground">Save & Organize</h3>
                            <p className="text-muted-foreground">
                                Keep track of your best ideas and organize them for future projects and inspiration.
                            </p>
                        </div>

                        <div className="light-beam-border rounded-xl bg-card/90 backdrop-blur-sm border border-border p-6">
                            <div className="mb-4 inline-block rounded-lg bg-emerald-500/18 p-3">
                                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-foreground">Smart Prompts</h3>
                            <p className="text-muted-foreground">
                                Use intelligent prompts and context to guide the AI toward exactly what you're looking for.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    )
}
