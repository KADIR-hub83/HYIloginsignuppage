'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, ChevronDown, Check } from 'lucide-react'
import AvailableToWorkIcon from '@/components/assets/edit-profile/available-to-work.svg'
import DesiredSalaryIcon from '@/components/assets/edit-profile/desired-salary.svg'
import EmploymentPreferenceIcon from '@/components/assets/edit-profile/employement-preference.svg'
import YearsOfExperienceIcon from '@/components/assets/edit-profile/years-of-experience.svg'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { companyApi } from '@/lib/services/companyApi'
import { z } from 'zod'
import { basicDetailsSchema } from '@/lib/validations/editProfile'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/helper/cropImage'

type Experience = {
  companyName: string
  workSince: string
  workTill: string
  designation: string
  currentlyWorking: boolean
  description: string
}

type BasicDetailsProps = {
  data: {
    firstName: string
    lastName: string
    fullName: string
    country: string
    city: string
    profilePicture: string
    resume: string
    preference: {
      employmentPreference: string
      hoursPerWeek: number
      desiredSalary: {
        currency: string
        price: number
      }
      availableHours: {
        from: string
        to: string
      }
    }
    experience: Experience[]
  }
}

interface Errors {
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  preference?: {
    employmentPreference?: string
    hoursPerWeek?: string
    desiredSalary?: {
      currency?: string
      price?: string
    }
    availableHours?: {
      from?: string
      to?: string
    }
  }
}

export default function BasicDetailsSection({ data }: BasicDetailsProps) {
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([])
  const [searchCountryTerm, setSearchCountryTerm] = useState('')
  const [cities, setCities] = useState<{ id: string; name: string }[]>([])
  const [openCountry, setOpenCountry] = useState(false)
  const [openCity, setOpenCity] = useState(false)
  const [searchCityTerm, setSearchCityTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [savedData, setSavedData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    fullName: data.fullName,
    profilePicture: data.profilePicture,
    country: data.country,
    city: data.city,
    preference: {
      employmentPreference: data?.preference?.employmentPreference || '',
      hoursPerWeek: data?.preference?.hoursPerWeek || 0,
      desiredSalary: {
        currency: data?.preference?.desiredSalary?.currency || '',
        price: data?.preference?.desiredSalary?.price || 0,
      },
      availableHours: {
        from: data?.preference?.availableHours?.from || '',
        to: data?.preference?.availableHours?.to || '',
      },
    },
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<string>(data?.profilePicture)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [openCropModal, setOpenCropModal] = useState(false)
  const [imageType, setImageType] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImageType(file.type)
      setUploadedProfilePicture(URL.createObjectURL(file))
      setOpenCropModal(true)
    }
  }

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCrop = async () => {
    if (!uploadedProfilePicture || !croppedAreaPixels || !selectedFile) return
    const croppedBlob = await getCroppedImg(uploadedProfilePicture, croppedAreaPixels, imageType)
    const croppedFile = new File([croppedBlob], selectedFile.name, { type: imageType })
    setSelectedFile(croppedFile)
    setCroppedImage(URL.createObjectURL(croppedBlob))
    setUploadedProfilePicture(URL.createObjectURL(croppedBlob))
    setOpenCropModal(false)
  }

  const yearsOfExperience =
    data.experience.length > 0
      ? `${new Date().getFullYear() - new Date(data.experience[0].workSince).getFullYear()} Years`
      : 'Not Specified'

  useEffect(() => {
    if (data) {
      setSavedData({
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        profilePicture: data.profilePicture,
        country: data.country,
        city: data.city,
        preference: {
          employmentPreference: data?.preference?.employmentPreference || '',
          hoursPerWeek: data?.preference?.hoursPerWeek || 0,
          desiredSalary: {
            currency: data?.preference?.desiredSalary?.currency || '',
            price: data?.preference?.desiredSalary?.price || 0,
          },
          availableHours: {
            from: data?.preference?.availableHours?.from || '',
            to: data?.preference?.availableHours?.to || '',
          },
        },
      })
    }
  }, [data])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        let data
        if (searchCountryTerm?.length >= 2) {
          data = await companyApi.getCountries(`?q=${searchCountryTerm}`)
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
  }, [searchCountryTerm])

  useEffect(() => {
    const fetchCities = async () => {
      try {
        let data
        if (searchCityTerm?.length >= 2) {
          data = await companyApi.getCities(`?q=${searchCityTerm}`)
        } else {
          data = await companyApi.getCities()
        }

        if (data?.success) {
          setCities(data.data)
        } else {
          setCities([])
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        setCities([])
      }
    }
    fetchCities()
  }, [searchCityTerm])

  const handleChange = (field: string, value: string) => {
    setSavedData(prev => {
      const updatedData = { ...prev }
      if (field.startsWith('preference.')) {
        const preferenceField = field.replace('preference.', '')
        if (preferenceField.startsWith('desiredSalary.')) {
          const salaryField = preferenceField.replace('desiredSalary.', '')
          updatedData.preference = {
            ...prev.preference,
            desiredSalary: {
              ...prev.preference.desiredSalary,
              [salaryField]: value,
            },
          }
        } else if (preferenceField.startsWith('availableHours.')) {
          const availableField = preferenceField.replace('availableHours.', '')
          updatedData.preference = {
            ...prev.preference,
            availableHours: {
              ...prev.preference.availableHours,
              [availableField]: value,
            },
          }
        } else {
          updatedData.preference = {
            ...prev.preference,
            [preferenceField]: value,
          }
        }
      } else {
        ;(updatedData as any)[field] = value
      }
      return updatedData
    })
    try {
      if (field in basicDetailsSchema.shape) {
        basicDetailsSchema.shape[field as keyof typeof basicDetailsSchema.shape].parse(value)
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors }
          if (field in newErrors) {
            delete newErrors[field as keyof typeof newErrors]
          }
          return newErrors
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Errors = error.errors.reduce((acc, err) => {
          if ('path' in err && 'message' in err) {
            const path = Array.isArray(err.path) ? err.path.join('.') : String(err.path)
            return { ...acc, [path]: err.message }
          }
          return acc
        }, {})
        setErrors(newErrors)
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      basicDetailsSchema.parse(savedData)
      const jsonData = {
        firstName: savedData.firstName,
        lastName: savedData.lastName,
        fullName: `${savedData.firstName} ${savedData.lastName}`,
        country: savedData.country,
        city: savedData.city,
        preference: savedData.preference,
      }
      const payload: Record<string, any> = { ...jsonData }
      if (selectedFile) {
        payload.profilePicture = selectedFile
      }
      await editProfileApi.updateTalent(payload)
      setIsEditing(false)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Errors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.')
          return { ...acc, [path]: err.message }
        }, {})
        setErrors(newErrors)
      }
    }
  }

  const handleFileUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    fileInputRef.current?.click()
  }


  return (
    <>
      <Card className="p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={uploadedProfilePicture || data?.profilePicture}
              alt="Avatar Icon"
              width={160}
              height={160}
              className="rounded-full object-cover border border-gray-300 aspect-square overflow-hidden"
            />
          </div>
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-2">
              <div className="flex flex-col sm:flex-row items-center space-x-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-semibold">
                    {savedData?.firstName} {savedData?.lastName}
                  </h2>
                  <p className="text-gray-600">{`${savedData?.country} ${savedData?.city}`}</p>
                </div>
              </div>
              <div className="flex justify-end items-center pb-2">
                <Pencil
                  size={20}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setIsEditing(true)}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-12 gap-y-4 -mt-4">
              <div className="flex flex-col w-full gap-2 sm:w-auto">
                <div className="flex items-center gap-2">
                  <Image src={AvailableToWorkIcon} alt="Available Icon" />
                  <span className="text-sm text-muted-foreground">Available To Work</span>
                </div>
                <span className="text-lg font-medium">{`${savedData.preference.availableHours.from} - ${savedData.preference.availableHours.to}`}</span>
              </div>
              <div className="flex flex-col w-full gap-2 sm:w-auto">
                <div className="flex items-center gap-2">
                  <Image src={EmploymentPreferenceIcon} alt="Employment Icon" />
                  <span className="text-sm text-muted-foreground">Employment Preference</span>
                </div>
                <span className="text-lg font-medium">
                  {savedData.preference.employmentPreference}
                </span>
              </div>
              <div className="flex flex-col w-full gap-2 sm:w-auto">
                <div className="flex items-center gap-2">
                  <Image src={YearsOfExperienceIcon} alt="Experience Icon" />
                  <span className="text-sm text-muted-foreground">Years of Experience</span>
                </div>
                <span className="text-lg font-medium">{yearsOfExperience}</span>
              </div>
              <div className="flex flex-col w-full gap-2 sm:w-auto">
                <div className="flex items-center gap-2">
                  <Image src={DesiredSalaryIcon} alt="Salary Icon" />
                  <span className="text-sm text-muted-foreground">Desired Salary / Hour</span>
                </div>
                <span className="text-lg font-medium">{`${savedData.preference.desiredSalary.price} ${savedData.preference.desiredSalary.currency}`}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle className="text-lg">Basic Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="flex flex-col gap-4 pb-4">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={croppedImage || uploadedProfilePicture || savedData?.profilePicture}
                alt="Avatar Icon"
                width={112}
                height={112}
                className="rounded-full object-cover border border-gray-300 aspect-square overflow-hidden"
              />
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                className="mt-2 pl-16 pr-16 border border-[#CEC0F6] text-base font-semibold text-primary bg-tab-bg rounded-full hover:bg-tab-bg hover:text-primary transition-all disabled:opacity-50 flex justify-center"
                onClick={handleFileUploadClick}
              >
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG (max. upto 5MB)</p>
            </div>
            <Dialog open={openCropModal} onOpenChange={setOpenCropModal}>
              <DialogHeader>
                <DialogTitle>Crop Image</DialogTitle>
              </DialogHeader>
              <DialogContent>
                <div className="relative w-full h-[300px]">
                  <Cropper
                    image={uploadedProfilePicture}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setOpenCropModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCrop}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">First Name</label>
                <Input
                  type="text"
                  value={savedData.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                />
                {typeof errors?.firstName === 'string' && (
                  <span className="text-xs text-destructive">{errors.firstName}</span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Last Name</label>
                <Input
                  type="text"
                  value={savedData.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                />
                {typeof errors?.lastName === 'string' && (
                  <span className="text-xs text-destructive">{errors.lastName}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Country</label>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild className="bg-white">
                    <Button variant="outline" className="w-full text-left">
                      {savedData.country || 'Select Your Country...'}
                      <ChevronDown className="ml-auto opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 border shadow-lg popover-content">
                    <Command>
                      <CommandInput
                        placeholder="Enter first 2 characters..."
                        value={searchCountryTerm}
                        onValueChange={setSearchCountryTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map(country => (
                            <CommandItem
                              key={`${country.id}-${country.name}`}
                              value={country.name}
                              onSelect={() => {
                                handleChange('country', country.name)
                                setOpenCountry(false)
                                setSearchCountryTerm('')
                              }}
                            >
                              {country.name}
                              <Check
                                className={
                                  savedData.country === country.name ? 'opacity-100' : 'opacity-0'
                                }
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {typeof errors?.country === 'string' && (
                  <span className="text-xs text-destructive">{errors.country}</span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">City</label>
                <Popover open={openCity} onOpenChange={setOpenCity}>
                  <PopoverTrigger asChild className="bg-white">
                    <Button variant="outline" className="w-full text-left">
                      {savedData.city || 'Select Your City...'}
                      <ChevronDown className="ml-auto opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 border shadow-lg popover-content">
                    <Command>
                      <CommandInput
                        placeholder="Enter first 2 characters..."
                        value={searchCityTerm}
                        onValueChange={setSearchCityTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {cities.map(city => (
                            <CommandItem
                              key={`${city.id}-${city.name}`}
                              value={city.name}
                              onSelect={() => {
                                handleChange('city', city.name)
                                setOpenCity(false)
                                setSearchCityTerm('')
                              }}
                            >
                              {city.name}
                              <Check
                                className={
                                  savedData.city === city.name ? 'opacity-100' : 'opacity-0'
                                }
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {typeof errors?.city === 'string' && (
                  <span className="text-xs text-destructive">{errors.city}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Employment Preference</label>
                <Select
                  value={savedData.preference.employmentPreference}
                  onValueChange={value => handleChange('preference.employmentPreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={savedData.preference.employmentPreference} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">
                  Number of Hours Available per Week
                </label>
                <Input
                  type="number"
                  value={savedData.preference.hoursPerWeek}
                  onChange={e => handleChange('preference.hoursPerWeek', e.target.value)}
                />
                {errors?.preference?.hoursPerWeek && (
                  <span className="text-xs text-destructive">{errors.preference.hoursPerWeek}</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2 w-1/2">
                <div className="w-1/2">
                  <label className="text-sm text-text-700 font-medium">Currency</label>
                  <Select
                    value={savedData.preference.desiredSalary.currency}
                    onValueChange={value =>
                      handleChange('preference.desiredSalary.currency', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={savedData.preference.desiredSalary.currency} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">United States Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preference?.desiredSalary?.currency && (
                    <span className="text-xs text-destructive">
                      {errors.preference.desiredSalary.currency}
                    </span>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="text-sm text-text-700 font-medium">Amount</label>
                  <Input
                    min="0"
                    type="number"
                    value={savedData.preference.desiredSalary.price}
                    onChange={e => handleChange('preference.desiredSalary.price', e.target.value)}
                  />
                  {errors?.preference?.desiredSalary?.price && (
                    <span className="text-xs text-destructive">
                      {errors.preference.desiredSalary.price}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 w-1/2">
                <div className="w-1/2">
                  <label className="text-sm text-text-700 font-medium">From</label>
                  <Select
                    value={savedData.preference.availableHours.from}
                    onValueChange={value => handleChange('preference.availableHours.from', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={savedData.preference.availableHours.from} />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 1}:00 AM`}>{`${i + 1}:00 AM`}</SelectItem>
                      ))}
                      {[...Array(12)].map((_, i) => (
                        <SelectItem
                          key={i + 12}
                          value={`${i + 1}:00 PM`}
                        >{`${i + 1}:00 PM`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/2">
                  <label className="text-sm text-text-700 font-medium">To</label>
                  <Select
                    value={savedData.preference.availableHours.to}
                    onValueChange={value => handleChange('preference.availableHours.to', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={savedData.preference.availableHours.to} />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={`${i + 1}:00 AM`}>{`${i + 1}:00 AM`}</SelectItem>
                      ))}
                      {[...Array(12)].map((_, i) => (
                        <SelectItem
                          key={i + 12}
                          value={`${i + 1}:00 PM`}
                        >{`${i + 1}:00 PM`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
