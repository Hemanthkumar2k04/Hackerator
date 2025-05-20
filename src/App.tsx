import './App.css'
import { SignedIn,SignedOut} from '@clerk/clerk-react'
import Navbar from './components/navbar'
import Home from './pages/home'
import Generate from './pages/generate'
function App() {

  return (
    <>
    <Navbar/>
     <SignedOut>
        <Home></Home>
     </SignedOut>
     <SignedIn>
       <Generate></Generate>
     </SignedIn>
    </>
  )
}

export default App