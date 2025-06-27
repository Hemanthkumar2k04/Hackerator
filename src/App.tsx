import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Navbar from './components/navbar';
import Home from './pages/home';
import Generate from './pages/generate';
import SavedIdeas from './components/savedIdeas';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Generate />
              </SignedIn>
              <SignedOut>
                <Home />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/saved"
          element={
            <SignedIn>
              <SavedIdeas />
            </SignedIn>
          }
        />
      </Routes>
    </>
  );
}

export default App;