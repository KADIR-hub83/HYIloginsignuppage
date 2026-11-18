'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

// Zod Imports
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn Imports
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

// Component Imports
import UserImage from '@/components/shared/userImage'
import UserInput from '@/components/shared/userInput'

// Config Import
import { userApi } from '@/lib/services/api'
import { PROFILE_MESSAGES } from '@/lib/config/messages'

// lucide-react Imports
import { Loader2 } from 'lucide-react'

// Context Imports
import { useApp } from '@/context/appContext'

// type declaration
type ProfileFormValues = z.infer<typeof profileFormSchema>

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// schema declaration
const profileFormSchema = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  middleName: z.string().optional().or(z.literal('')),
  lastName: z.string().min(1, 'Last Name must be at least 1 characters'),
  email: z.string().email('Please enter a valid email'),
  profilePicture: z
    .union([
      z.string(),
      z
        .instanceof(File)
        .refine(file => file.size <= 5 * 1024 * 1024, {
          message: 'File size must be less than 5MB',
        })
        .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
          message: 'Only JPG, JPEG, and PNG images are allowed',
        }),
    ])
    .optional()
    .nullable(),
})

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { profile, refreshProfile } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      middleName: profile?.middleName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      profilePicture: profile?.profilePicture || null,
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || '',
        middleName: profile.middleName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        profilePicture: profile.profilePicture,
      })
    }
  }, [profile, form])

  const handleImageSelect = (file: File | null) => {
    if (file !== selectedImage) {
      setSelectedImage(file)
      form.setValue('profilePicture', file)
    }
  }

async function onSubmit(data: ProfileFormValues) {
  if (!profile?._id) {
    toast({
      variant: 'destructive',
      title: 'Profile not found',
      description: 'Please refresh the page and try again.',
    })
    return
  }

  try {
    setIsLoading(true)

    await userApi.updateProfile(profile._id, {
      firstName: data.firstName,
      middleName: data.middleName || '',
      lastName: data.lastName,
      email: data.email,
      profilePicture: data.profilePicture || null,
    })

    toast(PROFILE_MESSAGES.UPDATE.SUCCESS)
    await refreshProfile()
    onOpenChange(false)
  } catch (error: any) {
    toast({
      variant: 'destructive',
      ...PROFILE_MESSAGES.UPDATE.ERROR,
      description: error.message || PROFILE_MESSAGES.UPDATE.ERROR.description,
    })
  } finally {
    setIsLoading(false)
  }
}

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your profile and preferences.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Customize how HYI.AI looks on your device.
            </p>
          </div> */}

          {/* <Separator /> */}

          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Update your profile information visible to others.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-10">
                <div className="flex flex-col items-start justify-start">
                  <UserImage
                    form={form}
                    name="profilePicture"
                    onImageSelect={handleImageSelect}
                    savedImage={
                      typeof profile?.profilePicture === 'string'
                        ? profile.profilePicture
                        : undefined
                    }
                    isCamera
                    height="h-32"
                    width="w-32"
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <UserInput
                    form={form}
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    mandatory
                  />
                  <div className="w-full flex gap-3">
                    <UserInput
                      form={form}
                      label="Middle Name"
                      name="middleName"
                      placeholder="Enter middle name"
                    />
                    <UserInput
                      form={form}
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter last name"
                      mandatory
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 mb-3">
                Recommended: Square image, at least 400x400px
              </p>
              <div className="w-full">
                <UserInput
                  form={form}
                  label="Email"
                  name="email"
                  placeholder="Enter email"
                  mandatory
                />
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
