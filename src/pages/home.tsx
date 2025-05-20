import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import '../css/home.css'; // Import the CSS file

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Hackerator</h1>
      <p className="home-subtitle">
        The ultimate platform for hackers and innovators.
      </p>
      <SignInButton>
        <button className="home-signin-button">Get Started</button>
      </SignInButton>
    </div>
  );
};

export default Home;