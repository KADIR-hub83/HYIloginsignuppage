'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, Pencil, Trash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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
import { editProfileApi } from '@/lib/services/editProfileApi'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'
import { z } from 'zod'
import { languageSchema } from '@/lib/validations/editProfile'

type Language = {
  language: string
  proficiency: string
}

type LanguageSectionProps = {
  languages: Language[]
}

interface Errors {
  [key: string]: string
}

export default function LanguageSection({ languages }: LanguageSectionProps) {
  const [languagesList, setLanguagesList] = useState<Language[]>(languages)
  const [tempLanguages, setTempLanguages] = useState<Language[]>(languages)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [languageOptions, setLanguageOptions] = useState<{ id: string; name: string }[]>([])
  const [searchLanguageTerm, setSearchLanguageTerm] = useState('')
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    setLanguagesList(languages)
    setTempLanguages(languages)
  }, [languages])

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        let data
        if (searchLanguageTerm?.length >= 2) {
          data = await editProfileApi.getLanguages(`?q=${searchLanguageTerm}`)
        } else {
          data = await editProfileApi.getLanguages()
        }

        if (data?.success) {
          setLanguageOptions(data.data)
        } else {
          setLanguageOptions([])
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
        setLanguageOptions([])
      }
    }
    fetchLanguages()
  }, [searchLanguageTerm])

  const handleAddLanguage = () => {
    setTempLanguages([...tempLanguages, { language: '', proficiency: '' }])
  }

  const handleDeleteLanguage = (index: number) => {
    const updatedLanguages = tempLanguages.filter((_, i) => i !== index)
    setTempLanguages(updatedLanguages)
  }

  const handleChange = (index: number, field: keyof Language, value: string) => {
    const updatedLanguages = tempLanguages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    )
    setTempLanguages(updatedLanguages)
    try {
      const fieldSchema = languageSchema.shape[field]
      fieldSchema.parse(value)
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[`${index}.${field}`]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [`${index}.${field}`]: (error as z.ZodError).errors[0].message,
        }))
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const schema = z.array(languageSchema)
      schema.parse(tempLanguages)

      await editProfileApi.updateTalent({ languages: tempLanguages })
      setLanguagesList(tempLanguages)
      setIsDialogOpen(false)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          return { ...acc, [`${err.path[0]}.${err.path[1]}`]: err.message }
        }, {})

        setErrors(newErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTempLanguages(languagesList)
    setIsDialogOpen(false)
    setErrors({})
  }

  return (
    <Card className="p-6 rounded-lg lg:col-span-1 h-auto min-h-[360px] relative overflow-auto">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Languages</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Pencil size={20} className="cursor-pointer text-gray-500" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Languages</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="mt-4 space-y-3">
              {tempLanguages.map((lang, index) => (
                <div key={index} className="flex items-center gap-2 w-full">
                  <div className="flex flex-col w-1/2">
                    <Popover
                      open={openDropdownIndex === index} // Open only for this row
                      onOpenChange={isOpen => setOpenDropdownIndex(isOpen ? index : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDropdownIndex === index}
                          className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
                        >
                          {lang.language || 'Select Your Language...'}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="p-0 border shadow-lg popover-content"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Enter first 2 characters..."
                            value={searchLanguageTerm}
                            onValueChange={value => setSearchLanguageTerm(value)}
                            className="w-full h-9 px-2"
                          />
                          <CommandList>
                            {languageOptions?.length === 0 ? (
                              <CommandEmpty>No Language found.</CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {languageOptions?.map(language => (
                                  <CommandItem
                                    key={`${language.id}-${index}`}
                                    value={language.name}
                                    onSelect={value => {
                                      handleChange(index, 'language', value)
                                      setOpenDropdownIndex(null)
                                      setSearchLanguageTerm('')
                                    }}
                                  >
                                    {language.name}
                                    <Check
                                      className={
                                        lang.language === language.name
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
                    {errors[`${index}.language`] && (
                      <span className="text-xs text-destructive">
                        {errors[`${index}.language`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <Select
                      value={lang.proficiency}
                      onValueChange={value => handleChange(index, 'proficiency', value)}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select Proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownValue.proficiency.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`${index}.proficiency`] && (
                      <span className="text-xs text-destructive">
                        {errors[`${index}.proficiency`]}
                      </span>
                    )}
                  </div>
                  <Trash
                    size={20}
                    color="#717680"
                    className="cursor-pointer ml-4"
                    onClick={() => handleDeleteLanguage(index)}
                  />
                </div>
              ))}
              <Button
                type="button"
                className="text-primary hover:text-primary font-semibold"
                onClick={handleAddLanguage}
                variant="ghost"
              >
                Add Language
              </Button>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 space-y-3">
        {dropdownValue.proficiency.map(proficiency => {
          const filteredLanguages = languagesList.filter(lang => lang.proficiency === proficiency)
          return filteredLanguages.length > 0 ? (
            <div key={proficiency} className="mb-4">
              <h4 className="text-sm text-text-600 font-semibold">{proficiency}</h4>
              <div className="space-y-1">
                {filteredLanguages.map((lang, index) => (
                  <span key={index} className="block text-lg font-medium">
                    {lang.language}
                  </span>
                ))}
              </div>
            </div>
          ) : null
        })}
      </div>
    </Card>
  )
}
