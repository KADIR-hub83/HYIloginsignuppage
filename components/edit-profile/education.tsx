'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Pencil, ChevronDown, Check } from 'lucide-react'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { z } from 'zod'
import { educationSchema } from '@/lib/validations/editProfile'

type Education = {
  university: string
  degree: string
  specialization: string
  passingOutYear: string
}

interface Errors {
  [key: number]: { [field: string]: string }
}

export default function EducationSection({
  education: initialEducation,
}: {
  education: Education[]
}) {
  const [education, setEducation] = useState<Education[]>(initialEducation)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [tempEducations, setTempEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(false)
  const [universitiesOptions, setUniversitiesOptions] = useState<{ id: string; name: string }[]>([])
  const [searchUniversitiesTerm, setSearchUniversitiesTerm] = useState('')
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [degreesOptions, setDegreesOptions] = useState<{ id: string; name: string }[]>([])
  const [searchDegreeTerm, setSearcDegreeTerm] = useState('')
  const [openDegreeIndex, setOpenDegreeIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [open, setOpen] = useState(false)

  const selectedDate =
    editingIndex !== null && tempEducations[editingIndex]?.passingOutYear
      ? new Date(
          tempEducations[editingIndex].passingOutYear.length === 4
            ? `${tempEducations[editingIndex].passingOutYear}-12-31T23:59:59.999Z`
            : tempEducations[editingIndex].passingOutYear
        )
      : undefined

  useEffect(() => {
    if (initialEducation && initialEducation.length > 0) {
      const formattedEducation = initialEducation.map(edu => ({
        ...edu,
        passingOutYear: edu?.passingOutYear?.slice(0, 4),
      }))
      setEducation(formattedEducation)
      setTempEducations(formattedEducation)
    }
  }, [initialEducation])

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        let response
        if (searchUniversitiesTerm?.length >= 2) {
          response = await editProfileApi.getUniversities(`?q=${searchUniversitiesTerm}`)
        } else {
          response = await editProfileApi.getUniversities()
        }
        if (response?.success && Array.isArray(response?.data)) {
          const formattedUniversities = response?.data?.map(
            (universitie: string, index: number) => ({
              id: `${index}`,
              name: universitie,
            })
          )
          setUniversitiesOptions(formattedUniversities)
        } else {
          setUniversitiesOptions([])
        }
      } catch (error) {
        console.error('Error fetching universities:', error)
        setUniversitiesOptions([])
      }
    }
    fetchUniversities()
  }, [searchUniversitiesTerm])

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        let response
        if (searchDegreeTerm?.length >= 2) {
          response = await editProfileApi.getDegrees(`?q=${searchDegreeTerm}`)
        } else {
          response = await editProfileApi.getDegrees()
        }
        if (response?.success && Array.isArray(response?.data)) {
          const formattedDegrees = response?.data?.map((degree: string, index: number) => ({
            id: `${index}`,
            name: degree,
          }))
          setDegreesOptions(formattedDegrees)
        } else {
          setDegreesOptions([])
        }
      } catch (error) {
        console.error('Error fetching degrees:', error)
        setDegreesOptions([])
      }
    }
    fetchDegrees()
  }, [searchDegreeTerm])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingIndex === null) return
    const updatedEducation = [...education]
    updatedEducation[editingIndex] = {
      ...tempEducations[editingIndex],
      passingOutYear: new Date(tempEducations[editingIndex].passingOutYear).toISOString(), // Store full date
    }
    setLoading(true)
    try {
      const educationArraySchema = z.array(educationSchema)
      educationArraySchema.parse(tempEducations)
      await editProfileApi.updateTalent({ education: updatedEducation })
      setEducation(updatedEducation)
      setEditingIndex(null)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce(
          (acc, err) => {
            const [index, field] = err.path
            if (typeof index === 'number' && typeof field === 'string') {
              acc[index] = { ...acc[index], [field]: err.message }
            }
            return acc
          },
          {} as Record<number, Partial<Education>>
        )
        setErrors(newErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setErrors({})
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    if (field === 'passingOutYear') {
      const formattedDate = new Date(value).toISOString()
      value = formattedDate
    }
    const updatedEducations = tempEducations.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    )
    setTempEducations(updatedEducations)
    const fieldSchema = educationSchema.shape[field as keyof typeof educationSchema.shape]
    if (fieldSchema instanceof z.ZodType) {
      try {
        fieldSchema.parse(value)
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors }
          if (newErrors[index]) {
            newErrors[index] = { ...newErrors[index] }
            delete newErrors[index][field]
            if (Object.keys(newErrors[index]).length === 0) delete newErrors[index]
          }
          return newErrors
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [index]: {
              ...prevErrors[index],
              [field]: (error as z.ZodError).errors.map(e => e.message).join(', '),
            },
          }))
        }
      }
    }
  }

  const handleAddEducation = () => {
    const newEducation: Education = {
      university: '',
      degree: '',
      specialization: '',
      passingOutYear: '',
    }
    setEditingIndex(education.length)
    setTempEducations([...education, newEducation])
  }

  const handleDeleteEducation = async (index: number) => {
    setLoading(true)
    try {
      const updatedEducation = education.filter((_, i) => i !== index)
      setEducation(updatedEducation)
      if (editingIndex === index) {
        setEditingIndex(null)
      }
      await editProfileApi.updateTalent({ education: updatedEducation })
    } catch (error) {
      console.error('Error deleting education record:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setTempEducations([...education])
  }

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Education</h3>
      </div>
      {editingIndex !== null && tempEducations.length > 0 ? (
        <form onSubmit={handleSave} className="pt-4 space-y-4">
          <div className="flex flex-col gap-4 pb-4 border-b bg-[#F5F5F5] rounded-md md:p-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">
                  University/Institute Name
                </label>
                <Popover
                  open={openDropdownIndex === editingIndex} // Open only for this row
                  onOpenChange={isOpen => setOpenDropdownIndex(isOpen ? editingIndex : null)}
                >
                  <PopoverTrigger asChild className="bg-white">
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDropdownIndex === editingIndex}
                      className="text-sm w-full px-4 py-1.5 pr-8 rounded-sm border justify-between overflow-hidden truncate whitespace-nowrap max-w-full"
                    >
                      {tempEducations[editingIndex]?.university || 'Select Your University...'}
                      <ChevronDown className="opacity-50 ml-2 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 border shadow-lg popover-content">
                    <Command>
                      <CommandInput
                        placeholder="Enter first 2 characters..."
                        value={searchUniversitiesTerm}
                        onValueChange={value => setSearchUniversitiesTerm(value)}
                        className="w-full h-9 px-2"
                      />
                      <CommandList>
                        {universitiesOptions?.length === 0 ? (
                          <CommandEmpty>No Universities found.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {universitiesOptions.map(university => (
                              <CommandItem
                                key={university.id} // Use id as key
                                value={university.name} // Use name property as value
                                onSelect={() => {
                                  handleEducationChange(editingIndex, 'university', university.name)
                                  setOpenDropdownIndex(null)
                                  setSearchUniversitiesTerm('')
                                }}
                              >
                                {university.name}
                                <Check
                                  className={
                                    tempEducations[editingIndex]?.university === university.name
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
                {errors[editingIndex]?.university && (
                  <span className="text-xs text-destructive">
                    {errors[editingIndex]?.university}
                  </span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Degree</label>
                <Popover
                  open={openDegreeIndex === editingIndex}
                  onOpenChange={isOpen => setOpenDegreeIndex(isOpen ? editingIndex : null)}
                >
                  <PopoverTrigger asChild className="bg-white">
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDegreeIndex === editingIndex}
                      className="text-sm w-full px-4 py-1.5 pr-8 rounded-sm border justify-between overflow-hidden truncate whitespace-nowrap max-w-full"
                    >
                      {tempEducations[editingIndex]?.degree || 'Select Your Degree...'}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 border shadow-lg popover-content">
                    <Command>
                      <CommandInput
                        placeholder="Enter first 2 characters..."
                        value={searchDegreeTerm}
                        onValueChange={value => setSearcDegreeTerm(value)}
                        className="w-full h-9 px-2"
                      />
                      <CommandList>
                        {degreesOptions?.length === 0 ? (
                          <CommandEmpty>No Degree found.</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {degreesOptions.map(degree => (
                              <CommandItem
                                key={degree.id} // Use id as key
                                value={degree.name} // Use name property as value
                                onSelect={() => {
                                  handleEducationChange(editingIndex, 'degree', degree.name)
                                  setOpenDegreeIndex(null)
                                  setSearcDegreeTerm('')
                                }}
                              >
                                {degree.name}
                                <Check
                                  className={
                                    tempEducations[editingIndex]?.degree === degree.name
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
                {errors[editingIndex]?.degree && (
                  <span className="text-xs text-destructive">{errors[editingIndex]?.degree}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Specialization</label>
                <Select
                  value={tempEducations[editingIndex]?.specialization}
                  onValueChange={value =>
                    handleEducationChange(editingIndex, 'specialization', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Computer Science',
                      'Information Technology',
                      'Electronics',
                      'Mechanical',
                      'Civil',
                    ].map(spec => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[editingIndex]?.specialization && (
                  <span className="text-xs text-destructive">
                    {errors[editingIndex]?.specialization}
                  </span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Passing out year</label>
                <div className="relative">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="bg-white">
                      <Button variant="outline" className="w-full justify-start text-left">
                        {selectedDate ? format(selectedDate, 'MMM yyyy') : 'Select Month & Year'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={date => {
                          if (date) {
                            handleEducationChange(
                              editingIndex,
                              'passingOutYear',
                              date.toISOString()
                            )
                            setOpen(false)
                          }
                        }}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={1975}
                        toYear={2025}
                        disableNavigation={false}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[editingIndex]?.passingOutYear && (
                    <span className="text-xs text-destructive">
                      {errors[editingIndex]?.passingOutYear}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-semibold text-primary hover:text-primary"
                  onClick={() => handleDeleteEducation(editingIndex!)}
                >
                  Delete
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-4">
          {education.length === 0 ? (
            <p className="text-gray-500">No education details available.</p>
          ) : (
            education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start pb-4">
                <div>
                  <h4 className="text-lg font-semibold">
                    {edu.degree} in {edu.specialization}
                  </h4>
                  <p className="text-base text-text-600 font-medium">
                    {edu.university} |{' '}
                    {edu.passingOutYear ? format(new Date(edu.passingOutYear), 'MMM yyyy') : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Pencil
                    size={20}
                    className="cursor-pointer text-gray-500"
                    onClick={() => handleEdit(index)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        className="font-semibold text-primary hover:text-primary pl-0"
        onClick={handleAddEducation}
      >
        + Add Education
      </Button>
    </Card>
  )
}
