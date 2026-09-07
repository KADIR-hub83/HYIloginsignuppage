'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, X, ChevronDown, Check } from 'lucide-react'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'

type Skill = {
  skill: string
  experienceYear: string
  experienceMonth: string
}

type TechnicalSkillsSectionProps = {
  technicalSkills: { skill: string; experience: string }[]
  softSkills: string[]
}

export default function TechnicalSkillsSection({
  technicalSkills,
  softSkills,
}: TechnicalSkillsSectionProps) {
  const parsedSkills: Skill[] = technicalSkills.map(skill => {
    const [year, month] = skill.experience.split('.')
    return {
      skill: skill.skill,
      experienceYear: year.trim() || '0',
      experienceMonth: month.trim() || '0',
    }
  })

  const [skills, setSkills] = useState<Skill[]>(parsedSkills)
  const [softSkillsList, setSoftSkillsList] = useState<string[]>(softSkills)
  const [newSkill, setNewSkill] = useState('')
  const [experienceYear, setExperienceYear] = useState('0')
  const [experienceMonth, setExperienceMonth] = useState('0')
  const [newSoftSkill, setNewSoftSkill] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [skillsOptions, setSkillsOptions] = useState<{ id: string; name: string }[]>([])
  const [searchSkillTerm, setSearchSkillTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(false)

  useEffect(() => {
    setSkills(parsedSkills)
    setSoftSkillsList(softSkills)
  }, [technicalSkills, softSkills])

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        technicalSkills: skills.map(skill => ({
          skill: skill.skill,
          experience: `${skill.experienceYear}.${skill.experienceMonth}`,
        })),
        otherSkills: softSkillsList,
      }
      await editProfileApi.updateTalent(payload)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { skill: newSkill, experienceYear, experienceMonth }])
      setNewSkill('')
      setExperienceYear('0')
      setExperienceMonth('0')
      setOpenDropdown(false)
    }
  }

  const handleDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim()) {
      setSoftSkillsList(prevSoftSkills => [...prevSoftSkills, newSoftSkill])
      setNewSoftSkill('')
    }
  }

  const handleDeleteSoftSkill = (index: number) => {
    setSoftSkillsList(softSkillsList.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Skills</h3>
        <Pencil
          size={20}
          className="cursor-pointer text-gray-500"
          onClick={() => setIsEditing(!isEditing)}
        />
      </div>
      {isEditing ? (
        <form onSubmit={handleSave} className="pt-4 space-y-4">
          <div>
            <span className="text-base font-medium">Technical Skills</span>
            <div className="flex gap-2 mt-2 items-center">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Key Skills</label>
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
                      {newSkill || 'Select Skills'}
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
                                  setNewSkill(skill.name)
                                  setOpenDropdown(false)
                                  setSearchSkillTerm('')
                                }}
                              >
                                {skill.name}
                                {newSkill === skill.name && <Check className="opacity-100" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Experience</label>
                <div className="flex flex-row gap-2">
                  <Select onValueChange={setExperienceYear} value={experienceYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownValue.generateNumber(1, 30).map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} Years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setExperienceMonth} value={experienceMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Months" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownValue.generateNumber(0, 12).map(month => (
                        <SelectItem key={month} value={month.toString()}>
                          {month} Months
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddSkill}
                  className="text-primary font-semibold hover:text-primary"
                >
                  + Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
                >
                  {skill.skill} | {skill.experienceYear}
                  {skill.experienceMonth !== '0' ? `.${skill.experienceMonth}` : ''} yrs
                  <X
                    size={16}
                    className="cursor-pointer"
                    onClick={() => handleDeleteSkill(index)}
                  />
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-base font-medium">Soft Skills</span>
            <div className="flex gap-2 mt-2 justify-between items-center">
              <div className="w-full">
                <label className="text-sm text-text-700 font-medium">Soft Skills</label>
                <Input
                  type="text"
                  value={newSoftSkill}
                  onChange={e => setNewSoftSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSoftSkill()
                    }
                  }}
                  placeholder="Enter soft skill"
                />
              </div>
              <div className="mt-4 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddSoftSkill}
                  className="text-primary font-semibold hover:text-primary"
                >
                  + Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {softSkillsList.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
                >
                  {skill}
                  <X
                    size={16}
                    className="ml-2 cursor-pointer"
                    onClick={() => handleDeleteSoftSkill(index)}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col">
          <span className="text-base font-medium pt-4">Technical Skills</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map(skill => (
              <span
                key={skill.skill}
                className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
              >
                {skill.skill} | {skill.experienceYear}
                {skill.experienceMonth !== '0' ? `.${skill.experienceMonth}` : ''} yrs
              </span>
            ))}
          </div>
          <span className="text-base font-medium pt-4">Soft Skills</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {softSkillsList.map(skill => (
              <span
                key={skill}
                className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
