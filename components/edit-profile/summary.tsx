'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Pencil } from 'lucide-react'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { z } from 'zod'
import { summarySchema } from '@/lib/validations/editProfile'

type SummarySectionProps = {
  profileSummary: string
}

interface Errors {
  [key: string]: string
}

export default function SummarySection({ profileSummary }: SummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [summary, setSummary] = useState(profileSummary)
  const [tempSummary, setTempSummary] = useState(profileSummary)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    setSummary(profileSummary)
    setTempSummary(profileSummary)
  }, [profileSummary])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      summarySchema.parse({ profileSummary: tempSummary })
      setErrors({})
      const payload = { profileSummary: tempSummary }
      await editProfileApi.updateTalent(payload)
      setSummary(tempSummary)
      setIsEditing(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({ profileSummary: error.errors[0].message })
      } else {
        console.error('Error updating summary:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setTempSummary(newValue)
    try {
      summarySchema.parse({ profileSummary: newValue })
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({ profileSummary: error.errors[0].message })
      }
    }
  }

  const handleCancel = () => {
    setTempSummary(summary)
    setIsEditing(false)
    setErrors({})
  }

  const toggleEditing = () => {
    setIsEditing(prev => !prev)
  }

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Summary</h3>
        <Pencil
          size={20}
          className={`cursor-pointer ${isEditing ? 'text-black' : 'text-gray-500'}`}
          onClick={toggleEditing}
        />
      </div>
      {isEditing ? (
        <form onSubmit={handleSave} className="pt-4">
          <Textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            value={tempSummary}
            onChange={handleInputChange}
          />
          {errors.profileSummary && <span className="text-xs text-destructive">{errors.profileSummary}</span>}
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="pt-4 text-base text-text-600 break-words">{summary}</p>
      )}
    </Card>
  )
}
