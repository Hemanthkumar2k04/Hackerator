import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLogIn, FiLogOut } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { BackgroundGradient } from './ui/background-gradient';
import { authClient } from '@/lib/auth-client';

type NavbarProps = {
  variant?: 'public' | 'auth';
  onSignOut?: () => void;
};

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Templates', href: '/templates' },
];

export function Navbar({ variant = 'public'}: NavbarProps) {
  const showNavLinks = variant === 'auth';
  const showAuthButtons = variant !== 'auth';
  const showSignOutButton = variant === 'auth';
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transform-gpu will-change-transform">
      <div className="flex h-24 w-full items-center px-8">
        {/* Logo */}
        <div className="flex flex-1 items-center gap-2">
          <span className="text-3xl font-bold text-foreground">Hackerator</span>
        </div>

        {/* Nav Links */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {showNavLinks &&
            NAV_LINKS.map((link) => (
              <NavLink key={link.href} to={link.href} className="relative rounded-full">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      >
                        <BackgroundGradient
                          containerClassName="h-full w-full rounded-full p-[2px]"
                          className="h-full w-full rounded-full bg-background"
                        />
                      </motion.div>
                    )}
                    <span
                      className={`relative z-10 inline-flex items-center rounded-full px-6 py-3 text-lg font-medium transition ${
                        isActive
                          ? 'text-foreground'
                          : 'border border-border/60 text-muted-foreground hover:bg-foreground/10 hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
        </div>

        {/* CTA & Theme Toggle */}
        <div className="flex flex-1 items-center justify-end gap-8 text-lg">
          {showSignOutButton && session && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                {session.user.name}
              </span>
              <button onClick={handleSignOut} className="cursor-pointer">
                <span className="inline-flex items-center gap-2">
                  <span className="text-lg font-semibold">Sign Out</span>
                  <FiLogOut className="h-5 w-5" />
                </span>
              </button>
            </div>
          )}
          
          {showAuthButtons && (
            <>
              <NavLink
                to="/auth"
                className="inline-flex items-center justify-center gap-2 bg-transparent p-0 text-lg font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-0"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="text-lg font-medium">Sign in</span>
                  <FiLogIn className="h-5 w-5" />
                </span>
              </NavLink>
              <Button
                asChild
                className="justify-center rounded px-4 py-6 text-lg font-semibold bg-white text-black transition hover:bg-white/90 cursor-pointer"
              >
                <NavLink to="/auth">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-lg text-black font-semibold">Get Started</span>
                    <FiArrowRight className="h-5 w-5 text-black font-semibold" />
                  </span>
                </NavLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


