'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

// Component Imports
import { ResetPasswordDialog } from '@/components/talent-dashboard/main/reset-password-dialog'
import { SettingsDialog } from '@/components/talent-dashboard/main/settings-dialog'

// Config Import
import { authApi } from '@/lib/services/api'
import { AUTH_MESSAGES } from '@/lib/config/messages'

// lucide-react Imports
import { LogOut, Settings, User, KeyRound, Loader2, Pencil } from 'lucide-react'

// Context Imports
import { useApp } from '@/context/appContext'

export function UserNav() {
  const { profile, formIsCompleted } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      setIsMenuOpen(false)

      await authApi.logout()

      toast(AUTH_MESSAGES.LOGOUT.SUCCESS)

      localStorage.removeItem('token')
      sessionStorage.clear()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)

      toast({
        variant: 'destructive',
        ...AUTH_MESSAGES.LOGOUT.ERROR,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  profile?.profilePicture instanceof File
                    ? URL.createObjectURL(profile?.profilePicture)
                    : profile?.profilePicture || undefined
                }
                alt={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
              />

              {
                <AvatarFallback className="border border-text-300">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : profile?.firstName && profile?.lastName ? (
                    `${profile?.firstName?.charAt(0).toUpperCase()}${profile?.lastName?.charAt(0).toUpperCase()}`
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              }
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar
                  className={`h-10 w-10 ${!profile?.profilePicture && 'border border-border'}`}
                >
                  <AvatarImage
                    src={
                      profile?.profilePicture instanceof File
                        ? URL.createObjectURL(profile?.profilePicture)
                        : profile?.profilePicture || undefined
                    }
                    alt={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
                  />
                  <AvatarFallback>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : profile?.firstName && profile?.lastName ? (
                      `${profile?.firstName?.charAt(0).toUpperCase()}${profile?.lastName?.charAt(0).toUpperCase()}`
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white bg-green-500 z-10 "></div>
              </div>
              <div className="flex flex-col space-y-1">
                {profile ? (
                  <p className="text-sm font-medium leading-none">{`${profile?.firstName || 'John'} ${profile?.middleName || ''} ${profile.userType !== 'company' ? profile?.lastName || 'Doe' : ''}`}</p>
                ) : (
                  <Skeleton className="h-4 w-24" />
                )}
                <p className="text-xs leading-none text-muted-foreground">Manage your account</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setIsMenuOpen(false)
                setShowSettings(true)
              }}
              className="truncate"
            >
              <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setIsMenuOpen(false)
                setShowResetPassword(true)
              }}
              className="truncate"
            >
              <KeyRound className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Reset Password</span>
            </DropdownMenuItem>
            {formIsCompleted && (
              <DropdownMenuItem
                onClick={() => {
                  setIsMenuOpen(false)
                  router.push('/edit-profile')
                }}
                className="truncate"
              >
                <Pencil className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="truncate">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Sign out</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResetPasswordDialog open={showResetPassword} onOpenChange={setShowResetPassword} />

      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </>
  )
}
