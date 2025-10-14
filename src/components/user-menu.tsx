import React from 'react'
import {
  BoltIcon,
  LucideLogOut
} from "lucide-react"

import { useAuth } from '../contexts/AuthContext'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function UserMenu() {
  const {user, signOut, getProfile} = useAuth()
  const [name, setName] = React.useState<string>('')

  React.useEffect(() => {
    if (user?.id) {
      getProfile(user.id).then(profile => {
        setName(profile?.name || '')
      })
    }
  }, [user?.id, getProfile])

  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return ""
    const parts = name.split(" ")
    const firstInitial = parts[0]?.[0]?.toUpperCase() || ""
    const lastInitial = parts[parts.length - 1]?.[0]?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 -ml-10 rounded-full hover:border hover:glow-border hover:bg-emerald-500 hover:text-white">
          <Avatar>
            <AvatarImage src="/origin/avatar.jpg" alt="Profile image" />
            <AvatarFallback className="font-bold text-md justify-center cursor-pointer">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="px-2 py-1 text-md text-foreground">
          {name}
        </DropdownMenuLabel>
        
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-md font-normal text-muted-foreground">
            {user?.email || 'user@example.com'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-black">
          <LucideLogOut size={16} className="opacity-60" aria-hidden="true" />
          <span onClick={signOut}>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
