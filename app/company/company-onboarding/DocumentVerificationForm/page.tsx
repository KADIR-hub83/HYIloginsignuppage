'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { companyVerificationSchema } from '@/lib/validations/companyOnboard'
import { Check, ChevronDown } from 'lucide-react'
// shadcn Imports
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { companyApi } from '@/lib/services/companyApi'

export default function DocumentVerificationForm({
  initialData,
  onComplete,
  triggerSubmitRef,
  errors,
  setErrors,
  userType,
  theme,
}: any) {
  const [taxInfo, setTaxInfo] = useState(initialData ?? { tin: '', aadharCard: '' })
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)

  const handleFieldChange = (name: string, value: string | React.ChangeEvent<HTMLInputElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value.trim()
    setTaxInfo((prev: any) => {
      const updatedTaxInfo = { ...prev, [name]: newValue }
      const fieldValidation = companyVerificationSchema.safeParse(updatedTaxInfo)
      if (fieldValidation.success) {
        setErrors((prev: any) => {
          const { [name]: _, ...rest } = prev
          return rest
        })
      } else {
        const fieldError = fieldValidation.error.errors.find(err => err.path[0] === name)
        setErrors((prev: any) => ({
          ...prev,
          [name]: fieldError ? fieldError.message : undefined,
        }))
      }
      return updatedTaxInfo
    })
  }

  const handleSubmit = (e?: React.FormEvent): boolean => {
    e?.preventDefault()
    try {
      companyVerificationSchema.parse({ ...taxInfo, userType })
      setErrors({})
      onComplete(taxInfo)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          return { ...acc, [err.path[0]]: err.message }
        }, {})
        setErrors(newErrors)
      }
      return false
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        let data
        if (searchTerm?.length >= 2) {
          data = await companyApi.getCountries(`?q=${searchTerm}`)
        } else {
          data = await companyApi.getCountries()
        }

        if (data?.success) {
          setCountries(data.data)
        } else {
          setCountries([])
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        setCountries([])
      }
    }
    fetchCountries()
  }, [searchTerm])

  useEffect(() => {
    if (triggerSubmitRef) {
      triggerSubmitRef.current = handleSubmit
    }
  }, [triggerSubmitRef, taxInfo, handleSubmit])

  return (
    <>
      <section className="flex justify-center w-full">
        <Card
          className={`w-[900px] border-muted-foreground/25 ${theme === 'dark' ? 'bg-secondary' : 'bg-white'}`}
        >
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="flex text-lg items-center">
              <span className="text-muted-foreground">Company Information</span>
              <span className="mr-2 ml-2 text-muted-foreground">/</span>
              <span>
                {userType?.charAt(0).toUpperCase()}
                {userType?.slice(1)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-10">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div
                className={`flex flex-col lg:flex-row ${userType === 'company' ? 'lg:gap-4' : ''}`}
              >
                <div
                  className={`flex flex-col gap-1.5 ${userType === 'company' ? 'flex-1' : 'w-full'}`}
                >
                  <Label className="text-text-700">
                    Country
                    <span className="text-500 text-primary pl-0.5">*</span>
                  </Label>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="bg-white">
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
                      >
                        {taxInfo?.country || 'Select Your Country...'}
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
                          {countries?.length === 0 ? (
                            <CommandEmpty>No country found.</CommandEmpty>
                          ) : (
                            <CommandGroup>
                              {countries?.length > 0 &&
                                countries?.map(country => (
                                  <CommandItem
                                    key={`${country.id}${country.name}`}
                                    value={country.name}
                                    onSelect={value => {
                                      handleFieldChange('country', value)
                                      setOpen(false)
                                      setSearchTerm('')
                                    }}
                                  >
                                    {country.name}
                                    <Check
                                      className={
                                        taxInfo?.country === country.name
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
                  {errors?.country && (
                    <span className="text-xs text-destructive">{errors.country}</span>
                  )}
                </div>
                <div className="flex-1 mt-4 lg:mt-0">
                  {userType === 'company' ? (
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-text-700">
                        Company Type
                        <span className="text-500 text-primary pl-0.5">*</span>
                      </Label>
                      <Select
                        onValueChange={value => handleFieldChange('companyType', value)}
                        value={taxInfo?.companyType}
                      >
                        <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
                          <SelectValue placeholder="Select a Company Type" />
                        </SelectTrigger>
                        <SelectContent className="border rounded-sm">
                          <SelectItem className="select-item" value="private">
                            Private Limited
                          </SelectItem>
                          <SelectItem className="select-item" value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem className="select-item" value="sole-proprietor">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem className="select-item" value="trust">
                            Trust/NGO
                          </SelectItem>
                          <SelectItem className="select-item" value="huf">
                            HUF
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors?.companyType && (
                        <span className="text-xs text-destructive">{errors.companyType}</span>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <Label className="text-text-700">
                    {userType === 'company' ? 'Tax Identification Number (TIN)' : 'Aadhar Card'}
                    <span className="text-500 text-primary pl-0.5">*</span>
                  </Label>
                  <Input
                    type="text"
                    name={userType === 'company' ? 'tin' : 'aadharCard'}
                    placeholder="Enter Your Identification Number"
                    value={
                      userType === 'company' ? (taxInfo?.tin ?? '') : (taxInfo?.aadharCard ?? '')
                    }
                    onChange={e => handleFieldChange(e.target.name, e)}
                    className="text-sm w-full px-4 py-1.5 rounded-sm border"
                  />
                  {userType === 'company'
                    ? errors?.tin && <span className="text-xs text-destructive">{errors?.tin}</span>
                    : errors?.aadharCard && (
                        <span className="text-xs text-destructive">{errors?.aadharCard}</span>
                      )}
                </div>
                <div className="flex-1 flex flex-col gap-1.5 mt-4 lg:mt-0">
                  <Label className="text-text-700">
                    {userType === 'company' ? 'Company’s Permanent Account Number' : 'PAN Card'}
                    <span className="text-500 text-primary pl-0.5">*</span>
                  </Label>
                  <Input
                    type="text"
                    name={userType === 'company' ? 'companyAcNumber' : 'panCard'}
                    placeholder="Enter Your Permanent Account Number"
                    value={userType === 'company' ? (taxInfo?.companyAcNumber ?? '')  :(taxInfo?.panCard ?? '')}
                    onChange={e => handleFieldChange(e.target.name, e)}
                    className="text-sm w-full px-4 py-1.5 rounded-sm border"
                  />
                  {userType === 'company'
                    ? errors?.companyAcNumber && (
                        <span className="text-xs text-destructive">{errors?.companyAcNumber}</span>
                      )
                    : errors?.panCard && (
                        <span className="text-xs text-destructive">{errors?.panCard}</span>
                      )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
