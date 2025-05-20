import React from 'react';
import { SignInButton, SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';
import '../css/navbar.css'; // Import the CSS file

const Navbar: React.FC = () => {
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
            <a href="" className='myAccount'>My Account</a>
            <SignOutButton>Sign Out</SignOutButton>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;