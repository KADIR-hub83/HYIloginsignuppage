'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { z } from 'zod'
import { socialLinkSchema } from '@/lib/validations/editProfile'

type SocialLinks = {
  linkedin: string
  github: string
  portfolio: string
}

type SocialLinksSectionProps = {
  socialLinks: SocialLinks
}

export default function SocialLinksSection({ socialLinks }: SocialLinksSectionProps) {
  const [links, setLinks] = useState<SocialLinks>(socialLinks)
  const [tempLinks, setTempLinks] = useState<SocialLinks>(socialLinks)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setLinks(socialLinks)
    setTempLinks(socialLinks)
  }, [socialLinks])

  const handleChange = (key: keyof SocialLinks, value: string) => {
    setTempLinks(prevLinks => ({ ...prevLinks, [key]: value }))
    const fieldValidation = socialLinkSchema.shape[key].safeParse(value)
    if (fieldValidation.success) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[key]
        return newErrors
      })
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [key]: fieldValidation.error.errors[0].message,
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      socialLinkSchema.parse(tempLinks)
      await editProfileApi.updateTalent(tempLinks)
      setLinks(tempLinks)
      setIsDialogOpen(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        console.error('Error updating social links:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTempLinks(links)
    setIsDialogOpen(false)
    setErrors({})
  }

  return (
    <Card className="p-6 rounded-lg lg:col-span-1 h-[360px] min-h-[360px] relative overflow-auto">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Social Links</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Pencil size={20} className="cursor-pointer text-gray-500" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Social Links</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="mt-4 space-y-3">
              {Object.entries(tempLinks).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm text-muted-foreground font-semibold capitalize">
                    {key}
                  </label>
                  <Input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={value}
                    onChange={e => handleChange(key as keyof SocialLinks, e.target.value)}
                  />
                  {errors[key] && <span className="text-xs text-destructive">{errors[key]}</span>}
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {Object.entries(links).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-sm text-muted-foreground font-semibold capitalize">{key}</span>
            <a
              href={value}
              className="text-blue-600 break-words max-w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              {value}
            </a>
          </div>
        ))}
      </div>
    </Card>
  )
}
