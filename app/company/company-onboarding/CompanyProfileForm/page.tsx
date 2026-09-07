// 'use client'
// import { useState, useEffect } from 'react'
// import { cn } from '@/lib/utils'
// import { z } from 'zod'
// import { companyOnboardSchema } from '@/lib/validations/companyOnboard'
// import { Check, ChevronDown, Asterisk } from 'lucide-react'
// // shadcn Imports
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { companyApi } from '@/lib/services/companyApi'
// import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'


// export default function CompanyProfileForm({
//   initialData,
//   onComplete,
//   triggerSubmitRef,
//   errors,
//   setErrors,
//   userType,
//   companyName,
//   theme,
// }: any) {
// const [companyInfo, setCompanyInfo] = useState({
//   organizationFromIndex:
//     initialData?.organizationFromIndex || '',

//   name:
//     initialData?.name ||
//     initialData?.companyName ||
//     initialData?.individualName ||
//     companyName ||
//     '',

//   website:
//     initialData?.website || '',

//   designation:
//     initialData?.designation || '',

//   businessType:
//     initialData?.businessType || '',

//   industryType:
//     initialData?.industryType || '',

//   projectScale:
//     initialData?.projectScale || '',

//   country:
//     initialData?.country || '',

//   companyType:
//     initialData?.companyType || '',

//   tin:
//     initialData?.tin || '',

//   aadharCard:
//     initialData?.aadharCard || '',

//   panCard:
//     initialData?.panCard || '',

//   companyAcNumber:
//     initialData?.companyAcNumber || '',
// })
//   const [designations, setDesignations] = useState<{ id: string; name: string }[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [open, setOpen] = useState(false)
//   const [openDesignation, setOpenDesignation] = useState(false)

//   useEffect(() => {
//     if (companyName) {
//       setCompanyInfo((prev: any) => ({ ...prev, name: companyName }))
//     }
//   }, [companyName])

//   const handleFieldChange = (name: string, value: string | React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = typeof value === 'string' ? value : value.target.value
//     setCompanyInfo((prev: any) => ({ ...prev, [name]: newValue }))
//     const fieldValidation = companyOnboardSchema.safeParse({
//       ...companyInfo,
//       [name]: newValue,
//     })
//     if (fieldValidation.success) {
//       setErrors((prev: any) => {
//         const { [name]: _, ...rest } = prev
//         return rest
//       })
//     } else {
//       const fieldError = fieldValidation.error.errors.find(err => err.path[0] === name)
//       setErrors((prev: any) => ({
//         ...prev,
//         [name]: fieldError ? fieldError.message : undefined,
//       }))
//     }
//   }

//   const handleSubmit = (e?: React.FormEvent): boolean => {
//     e?.preventDefault()
//     try {
//       companyOnboardSchema.parse({ ...companyInfo, userType })
//       setErrors({})
//       onComplete(companyInfo)
//       return true
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const newErrors = error.errors.reduce((acc, err) => {
//           return { ...acc, [err.path[0]]: err.message }
//         }, {})
//         setErrors(newErrors)
//       }
//       return false
//     }
//   }

// useEffect(() => {
//   let isMounted = true

//   const fetchDesignations = async () => {
//     try {
//       const query =
//         searchTerm?.trim().length >= 2
//           ? `?q=${encodeURIComponent(searchTerm.trim())}`
//           : ''

//       const response = await companyApi.getDesignations(query)

//       if (!isMounted) return

//       const rawData = Array.isArray(response?.data)
//         ? response.data
//         : []

//       const formattedDesignations = rawData
//         .map((item: any) => ({
//           id: String(item?._id || item?.id || item?.name || ''),
//           name: String(item?.name || '').trim(),
//         }))
//         .filter(
//           (item: { id: string; name: string }) =>
//             item.name.length > 0,
//         )

//       setDesignations(formattedDesignations)
//     } catch (error) {
//       console.error('Error fetching designations:', error)

//       if (isMounted) {
//         setDesignations([])
//       }
//     }
//   }

//   fetchDesignations()

//   return () => {
//     isMounted = false
//   }
// }, [searchTerm])

//   useEffect(() => {
//     if (triggerSubmitRef) {
//       triggerSubmitRef.current = handleSubmit
//     }
//   }, [triggerSubmitRef, handleSubmit])

//   return (
//     <>
//       <section className="flex justify-center w-full">
//         <Card
//           className={`w-[900px] border-muted-foreground/25 ${theme === 'dark' ? 'bg-secondary' : 'bg-card'}`}
//         >
//           <CardHeader className="flex flex-row justify-between">
//             <CardTitle className="flex font-semibold text-lg items-center">
//               {userType === 'company' ? 'Company Information' : 'Individual Information'}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pb-10">
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <div className="flex flex-col lg:flex-row lg:gap-4">
//                 <div className="flex-1 flex flex-col gap-1.5">
//                   <Label className="text-text-700">
//                     {userType === 'company' ? 'Company Name' : 'Name'}
//                     <span className="text-500 text-primary pl-0.5">*</span>
//                   </Label>
//                   <Input
//                     type="text"
//                     name="name"
//                     placeholder="Enter Company Name"
//                     value={companyInfo?.name}
//                     onChange={e => handleFieldChange(e.target.name, e)}
//                     className="text-sm w-full px-4 py-1.5 rounded-sm border"
//                   />
//                   {errors?.name && <span className="text-xs text-destructive">{errors.name}</span>}
//                 </div>
//                 <div className="flex-1 flex flex-col gap-1.5 mt-4 lg:mt-0">
//                   <Label className="text-text-700">
//                     Website
//                     <span className="text-500 text-primary pl-0.5">*</span>
//                   </Label>
//                   <Input
//                     type="text"
//                     name="website"
//                     placeholder="Enter Website"
//                     value={companyInfo?.website}
//                     onChange={e => handleFieldChange(e.target.name, e)}
//                     className="text-sm w-full px-4 py-1.5 rounded-sm border"
//                   />
//                   {errors?.website && (
//                     <span className="text-xs text-destructive">{errors.website}</span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex flex-col lg:flex-row lg:gap-4">
//                 <div className="flex-1 flex flex-col gap-1.5">
//                   <Label className="text-text-700">
//                     Designation
//                     <span className="text-500 text-primary pl-0.5">*</span>
//                   </Label>
//                   <Popover
//   open={openDesignation}
//   onOpenChange={setOpenDesignation}
// >
//                     <PopoverTrigger asChild className="bg-white">
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={open}
//                         className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between"
//                       >
//                         {companyInfo?.designation || 'Select Your Designation...'}
//                         <ChevronDown className="opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent align="start" className="p-0 border shadow-lg popover-content">
//                       <Command>
//                         <CommandInput
//                           placeholder="Enter first 2 characters..."
//                           value={searchTerm}
//                           onValueChange={value => setSearchTerm(value)}
//                           className="w-full h-9 px-2"
//                         />
// <CommandList>
//   {designations.length === 0 ? (
//     <CommandEmpty>No Designation found.</CommandEmpty>
//   ) : (
//     <CommandGroup>
//       {designations.map(designation => (
//         <CommandItem
//   key={designation.id}
//   value={designation.name}
//   onSelect={() => {
//     handleFieldChange('designation', designation.name)
//     setOpenDesignation(false)
//   }}
// >
//   {designation.name}

//   <Check
//     className={cn(
//       'ml-auto h-4 w-4',
//       companyInfo?.designation === designation.name
//         ? 'opacity-100'
//         : 'opacity-0',
//     )}
//   />
// </CommandItem>
//       ))}
//     </CommandGroup>
//   )}
// </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                   {errors?.designation && (
//                     <span className="text-xs text-destructive">{errors.designation}</span>
//                   )}
//                 </div>
//                 <div className="flex-1 flex flex-col gap-1.5 mt-4 lg:mt-0">
//                   <Label className="text-text-700">
//                     Industry Type
//                     <span className="text-500 text-primary pl-0.5">*</span>
//                   </Label>
//                   <Select
//                     onValueChange={value => handleFieldChange('industryType', value)}
//                     value={companyInfo?.industryType}
//                   >
//                     <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
//                       <SelectValue placeholder="Select a Industry Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {dropdownValue.industryType.map(industry => (
//                         <SelectItem key={industry} value={industry}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors?.industryType && (
//                     <span className="text-xs text-destructive">{errors.industryType}</span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex flex-col lg:flex-row lg:gap-4">
//                 <div className="flex-1 flex flex-col gap-1.5">
//                   <Label className="text-text-700">
//                     Project Scale
//                     <span className="text-500 text-primary pl-0.5">*</span>
//                   </Label>
//                   <Select
//                     onValueChange={value => handleFieldChange('projectScale', value)}
//                     value={companyInfo?.projectScale}
//                   >
//                     <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
//                       <SelectValue placeholder="Select a Project Scale" />
//                     </SelectTrigger>
//                     <SelectContent className="border rounded-sm">
//                       <SelectItem className="select-item" value="small">
//                         Small (Up to 20 Team members)
//                       </SelectItem>
//                       <SelectItem className="select-item" value="medium">
//                         Medium (5 to 20 Team members)
//                       </SelectItem>
//                       <SelectItem className="select-item" value="large">
//                         Large (More than 20 Team members)
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {errors?.projectScale && (
//                     <span className="text-xs text-destructive">{errors.projectScale}</span>
//                   )}
//                 </div>
//                 <div className="flex-1 mt-4 lg:mt-0">
//                   {userType === 'company' ? (
//                     <div className="flex flex-col gap-1.5">
//                       <Label className="text-text-700">
//                         Business Type
//                         <span className="text-500 text-primary pl-0.5">*</span>
//                       </Label>
//                       <Select
//                         onValueChange={value => handleFieldChange('businessType', value)}
//                         value={companyInfo?.businessType}
//                       >
//                         <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
//                           <SelectValue placeholder="Select a Business Type" />
//                         </SelectTrigger>
//                         <SelectContent className="border rounded-sm">
//                           <SelectItem className="select-item" value="startup">
//                             Start Up
//                           </SelectItem>
//                           <SelectItem className="select-item" value="enterprise">
//                             Enterprise
//                           </SelectItem>
//                           <SelectItem className="select-item" value="agency">
//                             Agency
//                           </SelectItem>
//                           <SelectItem className="select-item" value="non-profit">
//                             Non Profit
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       {userType === 'company' && errors?.businessType && (
//                         <span className="text-xs text-destructive">{errors.businessType}</span>
//                       )}
//                     </div>
//                   ) : (
//                     ''
//                   )}
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </section>
//     </>
//   )
// }




















































'use client'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { z } from 'zod'

import {
  Check,
  ChevronDown,
} from 'lucide-react'

import {
  companyOnboardSchema,
} from '@/lib/validations/companyOnboard'

import {
  cn,
} from '@/lib/utils'

// shadcn
import {
  Label,
} from '@/components/ui/label'

import {
  Input,
} from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Button,
} from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// API
import {
  companyApi,
} from '@/lib/services/companyApi'

// Helpers
import {
  dropdownValue,
} from '@/lib/helper/dropdownValueGenerator'

interface CompanyInfo {
  organizationFromIndex: string
  name: string
  website: string
  designation: string
  businessType: string
  industryType: string
  projectScale: string
  country: string
  companyType: string
  tin: string
  aadharCard: string
  panCard: string
  companyAcNumber: string
}

interface Designation {
  id: string
  name: string
}

export default function CompanyProfileForm({
  initialData,
  onComplete,
  triggerSubmitRef,
  errors,
  setErrors,
  userType,
  companyName,
  theme,
}: any) {
  /*
  |--------------------------------------------------------------------------
  | Form state
  |--------------------------------------------------------------------------
  */

  const [
    companyInfo,
    setCompanyInfo,
  ] =
    useState<CompanyInfo>({
      organizationFromIndex:
        initialData?.organizationFromIndex ||
        '',

      name:
        initialData?.name ||
        initialData?.companyName ||
        initialData?.individualName ||
        companyName ||
        '',

      website:
        initialData?.website ||
        '',

      designation:
        initialData?.designation ||
        '',

      businessType:
        initialData?.businessType ||
        '',

      industryType:
        initialData?.industryType ||
        '',

      projectScale:
        initialData?.projectScale ||
        '',

      country:
        initialData?.country ||
        '',

      companyType:
        initialData?.companyType ||
        '',

      tin:
        initialData?.tin ||
        '',

      aadharCard:
        initialData?.aadharCard ||
        '',

      panCard:
        initialData?.panCard ||
        '',

      companyAcNumber:
        initialData?.companyAcNumber ||
        '',
    })

  const [
    designations,
    setDesignations,
  ] =
    useState<
      Designation[]
    >([])

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState('')

  const [
    openDesignation,
    setOpenDesignation,
  ] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | Sync initial data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCompanyInfo(
      prev => ({
        ...prev,

        organizationFromIndex:
          initialData?.organizationFromIndex ??
          prev.organizationFromIndex ??
          '',

        name:
          initialData?.name ||
          initialData?.companyName ||
          initialData?.individualName ||
          companyName ||
          prev.name ||
          '',

        website:
          initialData?.website ??
          prev.website ??
          '',

        designation:
          initialData?.designation ??
          prev.designation ??
          '',

        businessType:
          initialData?.businessType ??
          prev.businessType ??
          '',

        industryType:
          initialData?.industryType ??
          prev.industryType ??
          '',

        projectScale:
          initialData?.projectScale ??
          prev.projectScale ??
          '',

        country:
          initialData?.country ??
          prev.country ??
          '',

        companyType:
          initialData?.companyType ??
          prev.companyType ??
          '',

        tin:
          initialData?.tin ??
          prev.tin ??
          '',

        aadharCard:
          initialData?.aadharCard ??
          prev.aadharCard ??
          '',

        panCard:
          initialData?.panCard ??
          prev.panCard ??
          '',

        companyAcNumber:
          initialData?.companyAcNumber ??
          prev.companyAcNumber ??
          '',
      }),
    )
  }, [
    initialData,
    companyName,
  ])

  /*
  |--------------------------------------------------------------------------
  | Clear one field error
  |--------------------------------------------------------------------------
  */

  const clearFieldError =
    useCallback(
      (name: string) => {
        setErrors(
          (
            prev: Record<
              string,
              string
            >,
          ) => {
            const next = {
              ...prev,
            }

            delete next[
              name
            ]

            return next
          },
        )
      },
      [setErrors],
    )

  /*
  |--------------------------------------------------------------------------
  | Field change
  |--------------------------------------------------------------------------
  */

  const handleFieldChange =
    useCallback(
      (
        name: keyof CompanyInfo,
        value:
          | string
          | React.ChangeEvent<HTMLInputElement>,
      ) => {
        const newValue =
          typeof value ===
          'string'
            ? value
            : value.target
                .value

        const updatedData = {
          ...companyInfo,
          [name]:
            newValue,
        }

        setCompanyInfo(
          updatedData,
        )

        /*
         * Field-level validation should include
         * the current account type as well.
         */
        const result =
          companyOnboardSchema.safeParse(
            {
              ...updatedData,
              userType,
              type:
                userType,
            },
          )

        /*
         * If full form is valid,
         * clear field error.
         */
        if (
          result.success
        ) {
          clearFieldError(
            name,
          )
          return
        }

        /*
         * Only show error belonging
         * to currently changed field.
         */
        const fieldError =
          result.error.errors.find(
            error =>
              String(
                error.path[
                  0
                ],
              ) ===
              name,
          )

        if (
          !fieldError
        ) {
          clearFieldError(
            name,
          )
          return
        }

        setErrors(
          (
            prev: any,
          ) => ({
            ...prev,
            [name]:
              fieldError.message,
          }),
        )
      },
      [
        companyInfo,
        userType,
        setErrors,
        clearFieldError,
      ],
    )

  /*
  |--------------------------------------------------------------------------
  | Submit validation
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    useCallback(
      (
        e?: React.FormEvent,
      ): boolean => {
        e?.preventDefault()

        if (!userType) {
          console.error(
            'COMPANY FORM ERROR: userType is missing',
          )

          setErrors(
            (
              prev: any,
            ) => ({
              ...prev,
              userType:
                'Account type is required',
            }),
          )

          return false
        }

        const validationPayload =
          {
            ...companyInfo,

            /*
             * Support whichever property
             * your validation schema uses.
             */
            userType,
            type:
              userType,
          }

        console.log(
          'COMPANY VALIDATION PAYLOAD:',
          validationPayload,
        )

        const result =
          companyOnboardSchema.safeParse(
            validationPayload,
          )

        if (
          !result.success
        ) {
          const newErrors: Record<
            string,
            string
          > = {}

          result.error.errors.forEach(
            error => {
              const field =
                String(
                  error.path[
                    0
                  ],
                )

              if (
                !newErrors[
                  field
                ]
              ) {
                newErrors[
                  field
                ] =
                  error.message
              }
            },
          )

          console.error(
            'COMPANY VALIDATION ERRORS:',
            newErrors,
          )

          setErrors(
            newErrors,
          )

          return false
        }

        setErrors({})

        onComplete(
          companyInfo,
        )

        return true
      },
      [
        companyInfo,
        userType,
        setErrors,
        onComplete,
      ],
    )

  /*
  |--------------------------------------------------------------------------
  | Expose submit handler to parent
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !triggerSubmitRef
    ) {
      return
    }

    triggerSubmitRef.current =
      handleSubmit

    return () => {
      triggerSubmitRef.current =
        null
    }
  }, [
    triggerSubmitRef,
    handleSubmit,
  ])

  /*
  |--------------------------------------------------------------------------
  | Designations
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true

    const fetchDesignations =
      async () => {
        try {
          const trimmed =
            searchTerm.trim()

          const query =
            trimmed.length >=
            2
              ? `?q=${encodeURIComponent(
                  trimmed,
                )}`
              : ''

          const response =
            await companyApi.getDesignations(
              query,
            )

          if (!active) {
            return
          }

          const rawData =
            Array.isArray(
              response?.data,
            )
              ? response.data
              : []

          const formatted =
            rawData
              .map(
                (
                  item: any,
                ) => ({
                  id:
                    String(
                      item?._id ||
                        item?.id ||
                        item?.name ||
                        '',
                    ),

                  name:
                    String(
                      item?.name ||
                        '',
                    ).trim(),
                }),
              )
              .filter(
                (
                  item: Designation,
                ) =>
                  item.name
                    .length >
                  0,
              )

          setDesignations(
            formatted,
          )
        } catch (error) {
          console.error(
            'Error fetching designations:',
            error,
          )

          if (active) {
            setDesignations(
              [],
            )
          }
        }
      }

    fetchDesignations()

    return () => {
      active = false
    }
  }, [searchTerm])

  return (
    <section className="flex justify-center w-full">
      <Card
        className={`w-[900px] border-muted-foreground/25 ${
          theme === 'dark'
            ? 'bg-secondary'
            : 'bg-card'
        }`}
      >
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="flex font-semibold text-lg items-center">
            {userType ===
            'company'
              ? 'Company Information'
              : 'Individual Information'}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-10">
          <form
            className="space-y-4"
            onSubmit={
              handleSubmit
            }
          >
            {/* Name + Website */}
            <div className="flex flex-col lg:flex-row lg:gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <Label className="text-text-700">
                  {userType ===
                  'company'
                    ? 'Company Name'
                    : 'Name'}

                  <span className="text-primary pl-0.5">
                    *
                  </span>
                </Label>

                <Input
                  type="text"
                  name="name"
                  placeholder={
                    userType ===
                    'company'
                      ? 'Enter Company Name'
                      : 'Enter Name'
                  }
                  value={
                    companyInfo.name ||
                    ''
                  }
                  onChange={e =>
                    handleFieldChange(
                      'name',
                      e,
                    )
                  }
                  className="text-sm w-full px-4 py-1.5 rounded-sm border"
                />

                {errors?.name && (
                  <span className="text-xs text-destructive">
                    {
                      errors.name
                    }
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1.5 mt-4 lg:mt-0">
                <Label className="text-text-700">
                  Website

                  <span className="text-primary pl-0.5">
                    *
                  </span>
                </Label>

                <Input
                  type="text"
                  name="website"
                  placeholder="Enter Website"
                  value={
                    companyInfo.website ||
                    ''
                  }
                  onChange={e =>
                    handleFieldChange(
                      'website',
                      e,
                    )
                  }
                  className="text-sm w-full px-4 py-1.5 rounded-sm border"
                />

                {errors?.website && (
                  <span className="text-xs text-destructive">
                    {
                      errors.website
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Designation + Industry */}
            <div className="flex flex-col lg:flex-row lg:gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <Label className="text-text-700">
                  Designation

                  <span className="text-primary pl-0.5">
                    *
                  </span>
                </Label>

                <Popover
                  open={
                    openDesignation
                  }
                  onOpenChange={
                    setOpenDesignation
                  }
                >
                  <PopoverTrigger
                    asChild
                  >
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={
                        openDesignation
                      }
                      className="text-sm w-full px-4 py-1.5 rounded-sm border justify-between bg-white"
                    >
                      <span className="truncate">
                        {companyInfo.designation ||
                          'Select Your Designation...'}
                      </span>

                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="p-0 border shadow-lg popover-content"
                  >
                    <Command
                      shouldFilter={
                        false
                      }
                    >
                      <CommandInput
                        placeholder="Search designation..."
                        value={
                          searchTerm
                        }
                        onValueChange={
                          setSearchTerm
                        }
                        className="w-full h-9 px-2"
                      />

                      <CommandList>
                        {designations.length ===
                        0 ? (
                          <CommandEmpty>
                            No
                            Designation
                            found.
                          </CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {designations.map(
                              designation => (
                                <CommandItem
                                  key={
                                    designation.id
                                  }
                                  value={
                                    designation.name
                                  }
                                  onSelect={() => {
                                    handleFieldChange(
                                      'designation',
                                      designation.name,
                                    )

                                    setOpenDesignation(
                                      false,
                                    )
                                  }}
                                >
                                  {
                                    designation.name
                                  }

                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      companyInfo.designation ===
                                        designation.name
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ),
                            )}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {errors?.designation && (
                  <span className="text-xs text-destructive">
                    {
                      errors.designation
                    }
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1.5 mt-4 lg:mt-0">
                <Label className="text-text-700">
                  Industry Type

                  <span className="text-primary pl-0.5">
                    *
                  </span>
                </Label>

                <Select
                  onValueChange={value =>
                    handleFieldChange(
                      'industryType',
                      value,
                    )
                  }
                  value={
                    companyInfo.industryType ||
                    ''
                  }
                >
                  <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
                    <SelectValue placeholder="Select an Industry Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {dropdownValue.industryType.map(
                      industry => (
                        <SelectItem
                          key={
                            industry
                          }
                          value={
                            industry
                          }
                        >
                          {
                            industry
                          }
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                {errors?.industryType && (
                  <span className="text-xs text-destructive">
                    {
                      errors.industryType
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Project scale + business type */}
            <div className="flex flex-col lg:flex-row lg:gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <Label className="text-text-700">
                  Project Scale

                  <span className="text-primary pl-0.5">
                    *
                  </span>
                </Label>

                <Select
                  onValueChange={value =>
                    handleFieldChange(
                      'projectScale',
                      value,
                    )
                  }
                  value={
                    companyInfo.projectScale ||
                    ''
                  }
                >
                  <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
                    <SelectValue placeholder="Select a Project Scale" />
                  </SelectTrigger>

                  <SelectContent className="border rounded-sm">
                    <SelectItem value="small">
                      Small (Up to
                      20 Team
                      members)
                    </SelectItem>

                    <SelectItem value="medium">
                      Medium (5 to
                      20 Team
                      members)
                    </SelectItem>

                    <SelectItem value="large">
                      Large (More
                      than 20 Team
                      members)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {errors?.projectScale && (
                  <span className="text-xs text-destructive">
                    {
                      errors.projectScale
                    }
                  </span>
                )}
              </div>

              <div className="flex-1 mt-4 lg:mt-0">
                {userType ===
                'company' ? (
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-text-700">
                      Business
                      Type

                      <span className="text-primary pl-0.5">
                        *
                      </span>
                    </Label>

                    <Select
                      onValueChange={value =>
                        handleFieldChange(
                          'businessType',
                          value,
                        )
                      }
                      value={
                        companyInfo.businessType ||
                        ''
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-1.5 rounded-sm border">
                        <SelectValue placeholder="Select a Business Type" />
                      </SelectTrigger>

                      <SelectContent className="border rounded-sm">
                        <SelectItem value="startup">
                          Start Up
                        </SelectItem>

                        <SelectItem value="enterprise">
                          Enterprise
                        </SelectItem>

                        <SelectItem value="agency">
                          Agency
                        </SelectItem>

                        <SelectItem value="non-profit">
                          Non Profit
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {errors?.businessType && (
                      <span className="text-xs text-destructive">
                        {
                          errors.businessType
                        }
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}