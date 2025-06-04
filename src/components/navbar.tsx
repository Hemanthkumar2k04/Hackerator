import React, { useState, useRef, useEffect } from 'react';
import '../css/navbar.css';
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">Hackerator</div>
      <div className="navbar-signin">
        <SignedOut>
          <SignInButton>
            <button className="navbar-signin-button">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="navbar-account-menu" ref={menuRef}>
            <button
              className="navbar-account-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Account menu"
            >
              <img src="/account.svg" alt="My Account" />
            </button>
            {menuOpen && (
              <div className="navbar-dropdown">
                <a href="/saved" className="navbar-dropdown-item">Saved</a>
                <SignOutButton>
                  <button className="navbar-dropdown-item">Logout</button>
                </SignOutButton>
              </div>
            )}
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;