'use client'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Check, ChevronDown } from 'lucide-react'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { companyApi } from '@/lib/services/companyApi'
import { experienceSchema } from '@/lib/validations/editProfile'

type WorkExperience = {
  companyName: string
  workSince: string // Example: "Feb-2023"
  workTill: string // Example: "Jan-2025" or "present"
  designation: string
  currentlyWorking: boolean
  description: string
}

type WorkExperienceSectionProps = {
  experience: WorkExperience[]
}

interface Errors {
  [key: string]: string
}

export default function WorkExperienceSection({ experience }: WorkExperienceSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [experiences, setExperiences] = useState<WorkExperience[]>(experience)
  const [tempExperiences, setTempExperiences] = useState<WorkExperience | null>(null)
  const [loading, setLoading] = useState(false)
  const [designations, setDesignations] = useState<{ id: string; name: string }[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    setExperiences(experience)
  }, [experience])

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        let response
        if (searchTerm?.length >= 2) {
          response = await companyApi.getDesignations(`?q=${searchTerm}`)
        } else {
          response = await companyApi.getDesignations()
        }
        if (response?.success && Array.isArray(response.data[0]?.occupations)) {
          const formattedDesignations = response.data[0].occupations.map(
            (occupation: string, index: number) => ({
              id: `${index}`,
              name: occupation,
            })
          )
          setDesignations(formattedDesignations)
        } else {
          setDesignations([])
        }
      } catch (error) {
        console.error('Error fetching designations:', error)
        setDesignations([])
      }
    }
    fetchDesignations()
  }, [searchTerm])

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (editingIndex === null || tempExperiences === null) return
    setLoading(true)
    try {
      experienceSchema.parse(tempExperiences)
      const updatedExperiences = [...experiences]
      updatedExperiences[editingIndex] = tempExperiences
      const payload = {
        experience: updatedExperiences.map(exp => ({
          companyName: exp.companyName.trim(),
          designation: exp.designation.trim(),
          workSince: exp.workSince,
          workTill: exp.currentlyWorking ? 'present' : exp.workTill,
          currentlyWorking: exp.currentlyWorking,
          description: exp.description?.trim() || '',
        })),
      }
      await editProfileApi.updateTalent(payload)
      setExperiences(updatedExperiences)
      setEditingIndex(null)
      setTempExperiences(null)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          return { ...acc, [err.path[0]]: err.message }
        }, {})
        setErrors(newErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setTempExperiences(null)
    setErrors({})
  }

  const handleExperienceChange = (field: keyof WorkExperience, value: string | boolean) => {
    if (tempExperiences) {
      const updatedExperience = { ...tempExperiences, [field]: value }
      if (field in experienceSchema.shape) {
        try {
          experienceSchema.shape[field as keyof typeof experienceSchema.shape].parse(value)
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors }
            delete newErrors[field]
            return newErrors
          })
        } catch (error) {
          if (error instanceof z.ZodError) {
            setErrors(prevErrors => ({
              ...prevErrors,
              [field]: (error as z.ZodError).errors[0].message,
            }))
          }
        }
      }
      setTempExperiences(updatedExperience)
    }
  }

  const handleAddExperience = () => {
    const newExperience: WorkExperience = {
      companyName: '',
      designation: '',
      workSince: '',
      workTill: '',
      currentlyWorking: true,
      description: '',
    }
    setExperiences([...experiences, newExperience])
    setEditingIndex(experiences.length)
    setTempExperiences(newExperience)
  }

  const handleDeleteExperience = async (index: number) => {
    setLoading(true)
    try {
      const updatedExperiences = experiences.filter((_, i) => i !== index)
      setExperiences(updatedExperiences)
      if (editingIndex === index) {
        setEditingIndex(null)
        setTempExperiences(null)
      }
      await editProfileApi.updateTalent({ experience: updatedExperiences })
    } catch (error) {
      console.error('Error updating work experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setTempExperiences({ ...experiences[index] })
  }

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Work Experience</h3>
      </div>

      {editingIndex !== null && tempExperiences ? (
        <form onSubmit={handleSave} className="pt-4 space-y-4">
          <div className="flex flex-col gap-4 pb-4 border-b bg-[#F5F5F5] rounded-md md:p-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  type="text"
                  placeholder="Enter Company Name"
                  value={tempExperiences.companyName || ''}
                  onChange={e => handleExperienceChange('companyName', e.target.value)}
                />
                {errors?.companyName && (
                  <span className="text-xs text-destructive">{errors.companyName}</span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium">Designation</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild className="bg-white">
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
                    >
                      {tempExperiences.designation || 'Select Your Designation...'}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 border shadow-lg popover-content">
                    <Command>
                      <CommandInput
                        placeholder="Enter first 2 characters..."
                        value={searchTerm}
                        onValueChange={value => setSearchTerm(value)}
                        className="w-full h-9 px-2"
                      />
                      <CommandList>
                        {designations?.length === 0 ? (
                          <CommandEmpty>No Designation found.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {designations?.length > 0 &&
                              designations?.map(designation => (
                                <CommandItem
                                  key={`${designation.id}${designation.name}`}
                                  value={designation.name}
                                  onSelect={value => {
                                    handleExperienceChange('designation', value)
                                    setOpen(false)
                                    setSearchTerm('')
                                  }}
                                >
                                  {designation.name}
                                  <Check
                                    className={
                                      tempExperiences.designation === designation.name
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    }
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors?.designation && (
                  <span className="text-xs text-destructive">{errors.designation}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-medium">Working Since</label>
                <div className="flex gap-2">
                  <Select
                    value={tempExperiences?.workSince?.split('-')[1] || ''}
                    onValueChange={value =>
                      handleExperienceChange(
                        'workSince',
                        `${tempExperiences?.workSince?.split('-')[0] || 'Jan'}-${value}`
                      )
                    }
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(50)].map((_, i) => (
                        <SelectItem key={i} value={(2025 - i).toString()}>
                          {2025 - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={tempExperiences?.workSince?.split('-')[0] || ''}
                    onValueChange={value =>
                      handleExperienceChange(
                        'workSince',
                        `${value}-${tempExperiences?.workSince?.split('-')[1] || '2025'}`
                      )
                    }
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownValue.months.map(month => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium">Working Till</label>
                <div className="flex gap-2">
                  <Select
                    value={
                      tempExperiences?.currentlyWorking
                        ? 'present'
                        : tempExperiences?.workTill?.split('-')[1] || ''
                    }
                    onValueChange={value =>
                      handleExperienceChange(
                        'workTill',
                        value === 'present'
                          ? 'present'
                          : `${tempExperiences?.workTill?.split('-')[0] || 'Jan'}-${value}`
                      )
                    }
                    disabled={tempExperiences?.currentlyWorking}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      {[...Array(50)].map((_, i) => (
                        <SelectItem key={i} value={(2025 - i).toString()}>
                          {2025 - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={tempExperiences?.workTill?.split('-')[0] || ''}
                    onValueChange={value =>
                      handleExperienceChange(
                        'workTill',
                        `${value}-${tempExperiences?.workTill?.split('-')[1] || '2025'}`
                      )
                    }
                    disabled={tempExperiences?.currentlyWorking}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownValue.months.map(month => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Textarea
              placeholder="Describe your experience"
              value={tempExperiences?.description || ''}
              onChange={e => handleExperienceChange('description', e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={tempExperiences?.currentlyWorking || false}
                onCheckedChange={() =>
                  handleExperienceChange('currentlyWorking', !tempExperiences?.currentlyWorking)
                }
              />
              <label className="text-sm">I'm currently working here</label>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-semibold text-primary hover:text-primary"
                  onClick={() => handleDeleteExperience(editingIndex!)}
                >
                  Delete
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-4">
          {experiences &&
            experiences.map((exp, index) => (
              <div key={index} className="flex justify-between items-start pb-4">
                <div className="max-w-[95%]">
                  <h4 className="text-lg font-semibold">{exp.designation}</h4>
                  <p className="text-base text-[#252B37] font-medium">
                    {exp.companyName} | {exp.workSince} -{' '}
                    {exp.currentlyWorking ? 'Present' : exp.workTill}
                  </p>
                  <p className="text-base text-text-600 mt-2 break-words">{exp.description}</p>
                </div>
                <Pencil
                  size={20}
                  className="cursor-pointer text-gray-500"
                  onClick={() => handleEdit(index)}
                />
              </div>
            ))}
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        className="font-semibold text-primary hover:text-primary pl-0"
        onClick={handleAddExperience}
      >
        + Add Work Experience
      </Button>
    </Card>
  )
}
