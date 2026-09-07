'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check, ChevronDown, X } from 'lucide-react'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { companyApi } from '@/lib/services/companyApi'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import { useToast } from '@/hooks/use-toast'
import { addPostRequirementSchema } from '@/lib/validations/companyDashboard'

interface PostRequirementDialogProps {
  open: boolean
  onClose: (open: boolean) => void
  selectedProject: any
  onRequirementAdded: () => void
}

interface Errors {
  [key: string]: string
}

export default function PostRequirementDialog({
  open,
  onClose,
  selectedProject,
  onRequirementAdded,
}: PostRequirementDialogProps) {
  const [requirementData, setRequirementData] = useState({
    prDesignation: '',
    prWorkExperience: '',
    prNumberOfCandidates: '',
    prWorkDuration: '',
    prTechnicalSkills: [] as string[],
    prDescription: '',
  })
  const [designations, setDesignations] = useState<{ id: string; name: string }[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [openDesignation, setOpenDesignation] = useState(false)
  const [skillsOptions, setSkillsOptions] = useState<{ id: string; name: string }[]>([])
  const [searchSkillTerm, setSearchSkillTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const { toast } = useToast()

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
            (occupation: string, index: number) => ({ id: `${index}`, name: occupation })
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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        let response =
          searchSkillTerm.length >= 2
            ? await editProfileApi.getSkills(`?q=${searchSkillTerm}`)
            : await editProfileApi.getSkills()

        if (response?.success && Array.isArray(response?.data)) {
          setSkillsOptions(
            response.data.map((skill: string, index: number) => ({ id: `${index}`, name: skill }))
          )
        } else {
          setSkillsOptions([])
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
        setSkillsOptions([])
      }
    }
    fetchSkills()
  }, [searchSkillTerm])

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => {
        const updatedSkills = [...prev, skill]
        setRequirementData(prevData => ({ ...prevData, prTechnicalSkills: updatedSkills }))
        return updatedSkills
      })
    }
    setOpenDropdown(false)
    setSearchSkillTerm('')
  }

  const handleDeleteSkill = (index: number) => {
    setSelectedSkills(prev => {
      const updatedSkills = prev.filter((_, i) => i !== index)
      setRequirementData(prevData => ({ ...prevData, prTechnicalSkills: updatedSkills }))
      return updatedSkills
    })
  }

  const handleChange = (field: string, value: string | string[]) => {
    setRequirementData(prev => ({ ...prev, [field]: value }))
    const result = addPostRequirementSchema.safeParse({ ...requirementData, [field]: value })
    if (result.success) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    } else {
      setErrors(prevErrors => {
        const formattedErrors = result.error.format() as Record<string, { _errors?: string[] }>
        return { ...prevErrors, [field]: formattedErrors[field]?._errors?.[0] || '' }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = addPostRequirementSchema.safeParse(requirementData)
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {}
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    try {
      await companyDashboardApi.addPostRequirement({
        projectId: selectedProject._id,
        postRequirement: [{ ...requirementData }],
      })
      toast({ className: 'bg-green-600 text-white', title: 'Successfully Created Requirement' })
      onClose(false)
      if (onRequirementAdded) {
        onRequirementAdded()
      }
    } catch (error) {
      console.error('Adding Post Requirement failed:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <DialogHeader>
          <DialogTitle>Team Requirement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex gap-4">
            <div className="w-full sm:w-1/4">
              <Label className="text-text-700">
                Designation
                <span className="text-500 text-primary pl-0.5">*</span>
              </Label>
              <Popover open={openDesignation} onOpenChange={setOpenDesignation}>
                <PopoverTrigger asChild className="bg-white">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
                  >
                    {requirementData?.prDesignation || 'Select Your Designation...'}
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
                                  handleChange('prDesignation', value)
                                  setOpenDesignation(false)
                                  setSearchTerm('')
                                }}
                              >
                                {designation.name}
                                <Check
                                  className={
                                    requirementData?.prDesignation === designation.name
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
              {errors.prDesignation && (
                <p className="text-red-500 text-sm">{errors.prDesignation}</p>
              )}
            </div>
            <div className="w-full sm:w-1/4">
              <Label className="text-text-700">
                Work Experience
                <span className="text-500 text-primary pl-0.5">*</span>
              </Label>
              <Select onValueChange={value => handleChange('prWorkExperience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 Years</SelectItem>
                  <SelectItem value="1-2">1-2 Years</SelectItem>
                  <SelectItem value="2-5">2-5 Years</SelectItem>
                </SelectContent>
              </Select>
              {errors.prWorkExperience && (
                <p className="text-red-500 text-sm">{errors.prWorkExperience}</p>
              )}
            </div>
            <div className="w-full sm:w-1/4">
              <Label className="text-text-700">
                Number of Candidates
                <span className="text-500 text-primary pl-0.5">*</span>
              </Label>
              <Select onValueChange={value => handleChange('prNumberOfCandidates', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Number" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(20)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.prNumberOfCandidates && (
                <p className="text-red-500 text-sm">{errors.prNumberOfCandidates}</p>
              )}
            </div>
            <div className="w-full sm:w-1/4">
              <Label className="text-text-700">
                Work Duration
                <span className="text-500 text-primary pl-0.5">*</span>
              </Label>
              <Select onValueChange={value => handleChange('prWorkDuration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
              {errors.prWorkDuration && (
                <p className="text-red-500 text-sm">{errors.prWorkDuration}</p>
              )}
            </div>
          </div>
          <div className="w-full">
            <Label className="text-text-700">
              Technical Skills
              <span className="text-500 text-primary pl-0.5">*</span>
            </Label>
            <Popover
              key={`${openDropdown}-${skillsOptions.length}`}
              open={openDropdown}
              onOpenChange={setOpenDropdown}
            >
              <PopoverTrigger asChild className="bg-white">
                <Button
                  variant="outline"
                  className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
                >
                  {'Select Skills'}
                  <ChevronDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 border shadow-lg popover-content">
                <Command>
                  <CommandInput
                    placeholder="Enter first 2 characters..."
                    value={searchSkillTerm}
                    onValueChange={setSearchSkillTerm}
                  />
                  <CommandList>
                    {skillsOptions.length === 0 ? (
                      <CommandEmpty>No Skills found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {skillsOptions.map(skill => (
                          <CommandItem
                            key={skill.id}
                            onSelect={() => {
                              handleAddSkill(skill.name)
                              setOpenDropdown(false)
                              setSearchSkillTerm('')
                            }}
                          >
                            {skill.name}
                            {selectedSkills.includes(skill.name) && (
                              <Check className="opacity-100" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
                >
                  {skill}
                  <X
                    size={16}
                    className="cursor-pointer ml-2"
                    onClick={() => handleDeleteSkill(index)}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="w-full">
            <Label className="text-text-700">
              Description
              <span className="text-500 text-primary pl-0.5">*</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="Describe your experience and the skills you used."
              value={requirementData.prDescription}
              onChange={e => handleChange('prDescription', e.target.value)}
            />
            {errors.prDescription && <p className="text-red-500 text-sm">{errors.prDescription}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
