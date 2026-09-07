'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Pencil, Link, X, ChevronDown, Check  } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import LinkIcon from '@/components/assets/edit-profile/link.svg'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { z } from 'zod'
import { projectSchema } from '@/lib/validations/editProfile'

type Project = {
  projectTitle: string
  year: string
  projectLink: string
  technicalSkillUsed: string[]
  projectDescription: string
}

interface Errors {
  [key: number]: { [field: string]: string }
}

export default function ProjectSection({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [tempProjects, setTempProjects] = useState<Project[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [skillsOptions, setSkillsOptions] = useState<{ id: string; name: string }[]>([])
  const [searchSkillTerm, setSearchSkillTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    setProjects(initialProjects)
    setTempProjects(initialProjects)
  }, [initialProjects])

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

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (editingIndex === null) return
  
    setLoading(true)
    try {
      const projectArraySchema = z.array(projectSchema)
      projectArraySchema.parse(tempProjects)
  
      const updatedProjects = [...projects]
      updatedProjects[editingIndex] = { ...tempProjects[editingIndex] }
  
      await editProfileApi.updateTalent({ projects: updatedProjects })
      setProjects(updatedProjects)
      setEditingIndex(null)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          const [index, field] = err.path
          if (typeof index === 'number' && typeof field === 'string') {
            acc[index] = { ...acc[index], [field]: err.message }
          }
          return acc
        }, {} as Errors)
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

  const handleProjectChange = (field: keyof Project, value: string, index: number) => {
    setTempProjects(prevProjects =>
      prevProjects.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    )
    if (field in projectSchema.shape) {
      const fieldSchema = projectSchema.shape[field as keyof Omit<Project, "technicalSkillUsed">]
      const fieldValidation = fieldSchema.safeParse(value)
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        if (fieldValidation.success) {
          delete newErrors[index]?.[field]
          if (Object.keys(newErrors[index] || {}).length === 0) delete newErrors[index]
        } else {
          newErrors[index] = { ...newErrors[index], [field]: fieldValidation.error.errors[0].message }
        }
        return newErrors
      })
    }
  }

  const handleAddProject = () => {
    const newProject: Project = {
      projectTitle: '',
      year: '2024',
      projectLink: '',
      technicalSkillUsed: [],
      projectDescription: '',
    }
    setEditingIndex(projects.length)
    setTempProjects([...projects, newProject])
  }

  const handleDeleteProject = async (index: number) => {
    setLoading(true)
    try {
      const updatedProjects = projects.filter((_, i) => i !== index)
      setProjects(updatedProjects)
      if (editingIndex === index) {
        setEditingIndex(null)
      }
      await editProfileApi.updateTalent({ projects: updatedProjects })
    } catch (error) {
      console.error('Error deleting project record', error)
    } finally {
      setLoading(false)
    }
  }

  const removeSkill = (projIndex: number, skill: string) => {
    setTempProjects(prevProjects =>
      prevProjects.map((proj, i) =>
        i === projIndex
          ? { ...proj, technicalSkillUsed: proj.technicalSkillUsed.filter(s => s !== skill) }
          : proj
      )
    )
  }

  const addSkill = (projIndex: number) => {
    if (skillInput.trim() === '') return
    setTempProjects(prevProjects =>
      prevProjects.map((proj, i) =>
        i === projIndex && !proj.technicalSkillUsed.includes(skillInput.trim())
          ? { ...proj, technicalSkillUsed: [...proj.technicalSkillUsed, skillInput.trim()] }
          : proj
      )
    )
    setSkillInput('')
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setTempProjects([...projects])
  }

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Projects</h3>
      </div>

      {editingIndex !== null && tempProjects.length > 0 ? (
        <form onSubmit={handleSave} className="pt-4 space-y-4">
          <div className="flex flex-col gap-4 pb-4 border-b bg-[#F5F5F5] rounded-md md:p-6">
            <div>
              <label className="text-sm text-text-700 font-medium">Project Title</label>
              <Input
                type="text"
                value={tempProjects[editingIndex]?.projectTitle}
                onChange={e => handleProjectChange('projectTitle', e.target.value, editingIndex)}
              />
              {errors[editingIndex]?.projectTitle && (
                <span className="text-xs text-destructive">
                  {errors[editingIndex]?.projectTitle}
                </span>
              )}
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Year</label>
                <Select
                  value={tempProjects[editingIndex]?.year}
                  onValueChange={value => handleProjectChange('year', value, editingIndex)}
                >
                  <SelectTrigger className="w-full">
                    <span>{tempProjects[editingIndex]?.year}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i} value={(2025 - i).toString()}>
                        {2025 - i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[editingIndex]?.year && (
                  <span className="text-xs text-destructive">{errors[editingIndex]?.year}</span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Project Link</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Project URL"
                    value={tempProjects[editingIndex]?.projectLink}
                    onChange={e => handleProjectChange('projectLink', e.target.value, editingIndex)}
                  />
                  <Link className="absolute right-2 top-2 text-gray-400" size={16} />
                  {errors[editingIndex]?.projectLink && (
                    <span className="text-xs text-destructive">
                      {errors[editingIndex]?.projectLink}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm text-text-700 font-medium">Technical Skills</label>
              <div className="flex gap-2">
                <Popover key={`${openDropdown}-${skillsOptions.length}`} open={openDropdown} onOpenChange={setOpenDropdown}>
                  <PopoverTrigger asChild className="bg-white">
                    <Button
                      variant="outline"
                      className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
                    >
                      {skillInput || 'Add a Skill'}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 border shadow-lg popover-content">
                    <Command>
                      <CommandInput
                        placeholder="Enter first 2 characters..."
                        value={searchSkillTerm}
                        onValueChange={setSearchSkillTerm}
                        onKeyDown={e => e.key === 'Enter' && addSkill(editingIndex)}
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
                                  setSkillInput(skill.name)
                                  setOpenDropdown(false)
                                  setSearchSkillTerm('')
                                }}
                              >
                                {skill.name}
                                {skillInput === skill.name && <Check className="opacity-100" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button type="button" variant="ghost" onClick={() => addSkill(editingIndex)} className="text-primary font-semibold hover:text-primary">
                  + Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tempProjects[editingIndex]?.technicalSkillUsed.map(skill => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-4 py-1 text-sm font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
                  >
                    {skill}
                    <X
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => removeSkill(editingIndex, skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-text-700 font-medium">Description</label>
              <Textarea
                rows={3}
                value={tempProjects[editingIndex]?.projectDescription}
                placeholder="Describe your experience and the skills you used."
                onChange={e =>
                  handleProjectChange('projectDescription', e.target.value, editingIndex)
                }
              />
              {errors[editingIndex]?.projectDescription && (
                    <span className="text-xs text-destructive">
                      {errors[editingIndex]?.projectDescription}
                    </span>
                  )}
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-semibold text-primary hover:text-primary"
                  onClick={() => handleDeleteProject(editingIndex!)}
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
          {projects.map((proj, index) => (
            <div key={index} className="flex justify-between items-start pb-4">
              <div>
                <p className="text-base text-text-600 font-medium">{proj.year}</p>
                <h4 className="text-lg font-semibold">{proj.projectTitle}</h4>
                <p className="text-base text-text-600 mt-2 mb-2 break-all">
                  {proj.projectDescription}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {proj?.technicalSkillUsed?.map(skill => (
                    <span
                      key={skill}
                      className="px-4 py-1 text-sm font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {proj?.projectLink && (
                  <p className="text-sm mt-4 text-blue-500 flex flex-row gap-2">
                    <Image src={LinkIcon} alt="Link Icon" />
                    <a href={proj.projectLink} target="_blank" rel="noopener noreferrer">
                      Project Link
                    </a>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Pencil
                  size={20}
                  className="cursor-pointer text-gray-500"
                  onClick={() => handleEdit(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        className="font-semibold text-primary hover:text-primary pl-0"
        onClick={handleAddProject}
      >
        + Add Projects
      </Button>
    </Card>
  )
}
