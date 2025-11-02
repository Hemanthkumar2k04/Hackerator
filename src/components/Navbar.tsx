import { motion } from 'framer-motion';

interface NavbarProps {
    isSignedIn?: boolean;
    onSignIn?: () => void;
    onSignOut?: () => void;
    onNavigate?: (page: string) => void;
}

export function Navbar({
    isSignedIn = false,
    onSignIn,
    onSignOut,
    onNavigate,
}: NavbarProps) {
    return (
        <motion.nav
            className="fixed top-0 w-full bg-[hsl(220,15%,10%)] border-b border-border-subtle z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <button
                        onClick={() => onNavigate?.('home')}
                        className="flex items-center gap-2 bg-transparent border-none hover:bg-transparent p-0"
                    >
                        <div className="w-8 h-8 rounded bg-accent-primary flex items-center justify-center font-bold text-dark">
                            H
                        </div>
                        <span className="text-lg font-bold text-primary">Hackerator</span>
                    </button>

                    {/* Right side actions */}
                    <div className="flex items-center gap-4">
                        {isSignedIn && (
                            <>
                                <button
                                    onClick={() => onNavigate?.('saved')}
                                    className="text-secondary hover:text-primary transition"
                                >
                                    Saved Ideas
                                </button>
                                <button
                                    onClick={onSignOut}
                                    className="px-4 py-2 bg-accent-primary text-dark rounded hover:bg-accent-secondary transition"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                        {!isSignedIn && (
                            <button
                                onClick={onSignIn}
                                className="px-4 py-2 bg-accent-primary text-dark rounded hover:bg-accent-secondary transition"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
