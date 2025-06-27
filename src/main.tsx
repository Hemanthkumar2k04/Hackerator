import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { dark } from '@clerk/themes'
import { BrowserRouter } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{baseTheme: dark,}}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)