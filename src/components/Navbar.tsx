import { useState } from "react"
import Logo from "@/assets/IdeaForge.svg"

import {
  BookmarkIcon,
  HouseIcon,
} from "lucide-react"
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

import UserMenu from "./user-menu"
import { Button } from "./ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"


// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/home", label: "Home", icon: HouseIcon },
  { href: "/saved", label: "Saved", icon: BookmarkIcon },
]

export default function Navbar() {
  const location = useLocation()
  const { user} = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Brand/Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={Logo} alt="IdeaForge" className="h-20 w-auto" />
          </a>
          {/* App name - only show when logged in */}
          <span className="font-bold text-lg md:text-xl"><span className="text-emerald-500">I</span>dea<span className="text-emerald-500">F</span>orge</span>
          
          {/* Mobile menu trigger - only show when logged in */}
          {user && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                              const Icon = link.icon
                              const isActive = location.pathname === link.href
                              return (
                                <NavigationMenuItem key={index} className="w-full">
                                  <NavigationMenuLink asChild>
                                    <Link to={link.href} className="flex-row items-center gap-2 py-1.5">
                                      <Icon
                                        size={16}
                                        className={isActive ? "text-emerald-500" : "text-muted-foreground"}
                                        aria-hidden="true"
                                      />
                                      <span className={isActive ? "text-emerald-500" : ""}>{link.label}</span>
                                    </Link>
                                  </NavigationMenuLink>
                                </NavigationMenuItem>
                              )
                            })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          )}
          
        </div>
        {/* Middle area - only show navigation when logged in */}
        {user && (
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => {
              const Icon = link.icon
              const isActive = location.pathname === link.href
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.href}
                      className="flex size-8 items-center justify-center p-1.5"
                      title={link.label}
                    >
                      <Icon aria-hidden="true" className={isActive ? "text-emerald-500" : "text-foreground"} />
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        )}
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* User menu */}
                <UserMenu />
              </>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
    </header>
  )
}
