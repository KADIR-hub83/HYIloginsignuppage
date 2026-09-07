'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import * as z from 'zod'
import { createProjectSchema } from '@/lib/validations/companyDashboard'
import SuccessDialog from './create-project-success-dialog'
import { useApp } from '@/context/appContext'

interface CreateProjectDialogProps {
  open: boolean
  onClose: (open: boolean) => void
  selectedProject?: any
}

interface Errors {
  [key: string]: string
}

export default function CreateProjectDialog({
  open,
  onClose,
  selectedProject,
}: CreateProjectDialogProps) {
  const { updateProjectsList } = useApp()
  const [projectData, setProjectData] = useState({
    projectName: '',
    industryType: '',
    duration: '',
    projectType: '',
    projectDescription: '',
    projectBudgetRange: { currency: 'USD', budgetRangeFrom: '', budgetRangeTo: '' },
  })
  const [errors, setErrors] = useState<Errors>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedProject) {
      setProjectData({
        projectName: selectedProject?.projectName || '',
        industryType: selectedProject?.industryType || '',
        duration: selectedProject?.duration || '',
        projectType: selectedProject?.projectType || '',
        projectDescription: selectedProject?.projectDescription || '',
        projectBudgetRange: {
          currency: selectedProject?.projectBudgetRange?.currency || 'USD',
          budgetRangeFrom: selectedProject?.projectBudgetRange?.budgetRangeFrom || '',
          budgetRangeTo: selectedProject?.projectBudgetRange?.budgetRangeTo || '',
        },
      })
    }
  }, [selectedProject])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    const { name, value } = 'target' in e ? e.target : e // Handle both input & select changes
    setProjectData(prev => {
      if (name in createProjectSchema.shape.projectBudgetRange.shape) {
        // Handle budget & currency separately
        return { ...prev, projectBudgetRange: { ...prev.projectBudgetRange, [name]: value } }
      } else {
        return { ...prev, [name]: value }
      }
    })
    validateField(name, value)
  }

  const validateField = (fieldName: string, value: any) => {
    try {
      let schema
      if (fieldName in createProjectSchema.shape.projectBudgetRange.shape) {
        schema =
          createProjectSchema.shape.projectBudgetRange.shape[
            fieldName as keyof typeof createProjectSchema.shape.projectBudgetRange.shape
          ]
      } else {
        schema = createProjectSchema.shape[fieldName as keyof typeof createProjectSchema.shape]
      }
      schema.parse(value)
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [fieldName]: (error as z.ZodError).errors[0].message,
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = createProjectSchema.safeParse(projectData)
    if (!result.success) {
      const fieldErrors: Errors = {}
      result.error.errors.forEach(err => {
        const fieldPath = err.path.join('.')
        fieldErrors[fieldPath] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      let response
      let actionType = selectedProject ? 'update' : 'create'
      let successMessage =
        actionType === 'update'
          ? 'Your project has been successfully updated.'
          : 'Your project has been successfully created.'
      response = selectedProject
        ? await companyDashboardApi.updateProject({
            projectId: selectedProject._id,
            ...projectData,
          })
        : await companyDashboardApi.createProject(projectData)
      if (response.success) {
        setDialogMessage(successMessage)
        setIsError(false)
        await updateProjectsList()
      } else {
        setDialogMessage(response.message || 'An unexpected error occurred.')
        setIsError(true)
      }
    } catch (error) {
      console.error(`Project ${selectedProject ? 'update' : 'creation'} failed:`, error)
      setDialogMessage(
        `Failed to ${selectedProject ? 'update' : 'create'} project. Please try again later.`
      )
      setIsError(true)
    }
    setLoading(false)
    setShowSuccessDialog(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedProject ? 'Update Project' : 'Create New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-text-700">
                  Project Name
                  <span className="text-500 text-primary pl-0.5">*</span>
                </Label>
                <Input
                  name="projectName"
                  value={projectData.projectName}
                  onChange={handleChange}
                  placeholder="Enter Project Name"
                  required
                />
                {errors.projectName && <p className="text-red-500 text-sm">{errors.projectName}</p>}
              </div>
              <div>
                <Label className="text-text-700">
                  Industry Type
                  <span className="text-500 text-primary pl-0.5">*</span>
                </Label>
                <Select
                  value={projectData?.industryType}
                  onValueChange={value => handleChange({ name: 'industryType', value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownValue.industryType.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industryType && (
                  <p className="text-red-500 text-sm">{errors.industryType}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-text-700">
                  Project Type
                  <span className="text-500 text-primary pl-0.5">*</span>
                </Label>
                <Select
                  value={projectData?.projectType}
                  onValueChange={value => handleChange({ name: 'projectType', value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownValue.projectType.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectType && <p className="text-red-500 text-sm">{errors.projectType}</p>}
              </div>
              <div>
                <Label className="text-text-700">
                  Duration
                  <span className="text-500 text-primary pl-0.5">*</span>
                </Label>
                <Select
                  value={projectData?.duration}
                  onValueChange={value => handleChange({ name: 'duration', value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duration of Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownValue.duration.map(dur => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
              </div>
            </div>
            <div>
              <Label className="text-text-700">
                Project Description
                <span className="text-500 text-primary pl-0.5">*</span>
              </Label>
              <Textarea
                name="projectDescription"
                value={projectData.projectDescription}
                onChange={handleChange}
                placeholder="Describe your Project in a few words."
                required
                maxLength={480}
              />
              {errors.projectDescription && (
                <p className="text-red-500 text-sm">{errors.projectDescription}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-text-700">
                  Project Budget Range
                  <span className="text-500 text-primary pl-0.5">*</span>
                </Label>
                <Select
                  onValueChange={value => handleChange({ name: 'currency', value })}
                  value={projectData.projectBudgetRange.currency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {['USD', 'EUR', 'GBP', 'INR', 'JPY'].map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors['projectBudgetRange.currency'] && (
                  <p className="text-red-500 text-sm">{errors['projectBudgetRange.currency']}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <Label className="text-text-700">From</Label>
                  <Input
                    type="number"
                    name="budgetRangeFrom"
                    value={projectData.projectBudgetRange.budgetRangeFrom}
                    onChange={handleChange}
                    placeholder="Min Budget"
                    required
                    min="0"
                  />
                  {errors['projectBudgetRange.budgetRangeFrom'] && (
                    <p className="text-red-500 text-sm">
                      {errors['projectBudgetRange.budgetRangeFrom']}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <Label className="text-text-700">To</Label>
                  <Input
                    type="number"
                    name="budgetRangeTo"
                    value={projectData.projectBudgetRange.budgetRangeTo}
                    onChange={handleChange}
                    placeholder="Max Budget"
                    required
                    min="0"
                  />
                  {errors['projectBudgetRange.budgetRangeTo'] && (
                    <p className="text-red-500 text-sm">
                      {errors['projectBudgetRange.budgetRangeTo']}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              {loading ? (
                <Button disabled className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {showSuccessDialog && (
        <SuccessDialog
          open={showSuccessDialog}
          onClose={() => {
            setShowSuccessDialog(false)
            onClose(true)
          }}
          message={dialogMessage}
          isError={isError}
        />
      )}
    </>
  )
}
