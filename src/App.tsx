import { SignedIn, SignedOut} from '@clerk/clerk-react'
import Navbar from './components/navbar'
import Home from './pages/home'
import Generate from './pages/generate'

function App() {
  return (
    <>
      <Navbar />
      <SignedIn>
        <Generate></Generate>
      </SignedIn>
      <SignedOut>
        <Home></Home>
      </SignedOut>
    </>
  )
}

export default App