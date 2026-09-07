// // React Imports
// import React, { useEffect } from 'react'
// import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
// import { useFormContext } from 'react-hook-form'

// // shadcn Imports
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command'
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'

// // Config Import
// import { cn } from '@/lib/utils'

// // lucide-react Imports
// import { Check, ChevronDown, Asterisk, X } from 'lucide-react'

// interface UserSelectProps<FormType extends FieldValues> {
//   form: UseFormReturn<FormType>
//   name: Path<FormType>
//   label: string
//   placeholder: string
//   searchPlaceholder?: string
//   emptyPlaceholder?: string
//   mandatory?: boolean
//   isFlexcol?: boolean
//   hasDropdownValues?: boolean
//   hasBadge?: boolean
//   dropdownValue?: string[]
//   maxHeight?: string
//   isLabelVisible?: boolean
//   getDropdown?: (search: string) => Promise<any>
//   object?: boolean
// }

// type DataType = {
//   id: string
//   name: string
//   code?: string
//   occupations?: string[]
// }[]
// type Data = []

// export default function UserSelect<FormType extends FieldValues>({
//   form,
//   name,
//   label,
//   placeholder,
//   searchPlaceholder,
//   emptyPlaceholder,
//   mandatory = false,
//   isFlexcol = true,
//   hasDropdownValues = false,
//   hasBadge = false,
//   dropdownValue,
//   getDropdown,
//   maxHeight = '',
//   isLabelVisible = true,
//   object = false,
// }: UserSelectProps<FormType>) {
//   const { setValue, watch } = useFormContext()
//   const [open, setOpen] = React.useState(false)
//   const [search, setSearch] = React.useState('')
//   const [data, setData] = React.useState<DataType | Data>([])

//   const selectedSkills: string[] = watch(name) || []

//   const [isLoading, setIsLoading] = React.useState(true)

//   useEffect(() => {
//     async function fetchData(value: string) {
//       try {
//         // if (value.length < 2) return
//         if (getDropdown) {
//           setIsLoading(true)

//           const response = await getDropdown(value)
//           if (object) {
//             setData(response.data[0].occupations)
//           } else {
//             setData(response.data)
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load user profile:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchData(search)
//   }, [search])

//   const removeSkill = (skillToRemove: string) => {
//     const updatedSkills = selectedSkills.filter(skill => skill !== skillToRemove)
//     setValue(name as Path<FormType>, updatedSkills as any)
//   }

//   return (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => {
//         const { setValue } = useFormContext()

//         return (
//           <FormItem
//             className={`w-full flex ${isFlexcol ? 'flex-col' : 'items-start gap-3'} space-y-1.5`}
//           >
//             <FormLabel
//               className={`flex gap-0.5 ${isLabelVisible ? 'opacity-100' : 'opacity-0'} ${!isFlexcol && 'pt-4'}`}
//             >
//               {label}
//               {mandatory && (
//                 <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
//               )}
//             </FormLabel>
//             <div className={`w-full flex flex-col gap-1`}>
//               <FormControl>
//                 <>
//                   {!hasDropdownValues && !hasBadge && (
//                     <Popover open={open} onOpenChange={setOpen}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           aria-expanded={open}
//                           className={`w-full justify-between bg-white hover:bg-white hover:text-accent-foreground focus-visible:border-ring focus:ring-1 focus:ring-ring focus:ring-offset-0 ${!field.value && 'text-muted-foreground'}`}
//                         >
//                           {field.value
//                             ? data.find(item => item.name === field.value)?.name || field.value
//                             : placeholder}
//                           <ChevronDown className="w-5 h-5 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
//                         <Command>
//                           <CommandInput
//                             placeholder={searchPlaceholder}
//                             className="h-9"
//                             value={search}
//                             onValueChange={setSearch}
//                           />
//                           <CommandList>
//                             <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
//                             <CommandGroup>
//                               {data.map((data, index) => {
//                                 const value = typeof data === 'string' ? data : data.name
//                                 return (
//                                   <CommandItem
//                                     key={`${index}`}
//                                     value={value}
//                                     onSelect={currentValue => {
//                                       setValue(name, currentValue as any)
//                                       field.onChange(currentValue)
//                                       setOpen(false)
//                                     }}
//                                   >
//                                     {value}
//                                     <Check
//                                       className={cn(
//                                         'ml-auto',
//                                         field.value === value ? 'opacity-100' : 'opacity-0'
//                                       )}
//                                     />
//                                   </CommandItem>
//                                 )
//                               })}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                   )}
//                   {hasBadge && (
//                     <>
//                       <Popover open={open} onOpenChange={setOpen}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             role="combobox"
//                             aria-expanded={open}
//                             className={`w-full justify-between bg-white hover:bg-white hover:text-accent-foreground focus-visible:border-ring focus:ring-1 focus:ring-ring focus:ring-offset-0 ${!field.value && 'text-muted-foreground'}`}
//                           >
//                             {placeholder}
//                             <ChevronDown className="w-5 h-5 opacity-50" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
//                           <Command>
//                             <CommandInput
//                               placeholder={searchPlaceholder}
//                               className="h-9"
//                               value={search}
//                               onValueChange={setSearch}
//                             />
//                             <CommandList>
//                               <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
//                               <CommandGroup>
//                                 {data.map((data, index) => {
//                                   const value = typeof data === 'string' ? data : data.name
//                                   return (
//                                     <CommandItem
//                                       key={`${index}`}
//                                       value={value}
//                                       onSelect={currentValue => {
//                                         if (!selectedSkills.includes(currentValue)) {
//                                           const updatedSkills = [...selectedSkills, currentValue]

//                                           setValue(name, updatedSkills as any, {
//                                             shouldValidate: true,
//                                           })

//                                           field.onChange(updatedSkills)
//                                         }
//                                         setOpen(false)
//                                       }}
//                                     >
//                                       {value}
//                                       <Check
//                                         className={`ml-auto ${selectedSkills.includes(value) ? 'opacity-100' : 'opacity-0'}`}
//                                       />
//                                     </CommandItem>
//                                   )
//                                 })}
//                               </CommandGroup>
//                             </CommandList>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                       <div className="w-full pt-2">
//                         {/* Display Selected Skills as Badges */}
//                         <div className="flex flex-wrap gap-2">
//                           {selectedSkills.map(skill => {
//                             return (
//                               <Badge
//                                 key={skill}
//                                 variant="secondary"
//                                 className="px-2.5 py-1 flex items-center text-primary-foreground border-primary bg-primary hover:bg-primary/90 gap-2"
//                               >
//                                 {skill}
//                                 <X
//                                   className="h-4 w-4 cursor-pointer"
//                                   onClick={() => removeSkill(skill)}
//                                 />
//                               </Badge>
//                             )
//                           })}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                   {hasDropdownValues && !hasBadge && (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger
//                         className={`user-input hover:bg-card hover:text-accent-foreground ${!field.value && 'text-muted-foreground'}`}
//                         id={name}
//                       >
//                         <SelectValue placeholder={placeholder} {...field} />
//                       </SelectTrigger>
//                       <SelectContent className={`${maxHeight} p-0`}>
//                         <SelectGroup>
//                           {dropdownValue?.map((item, index) => (
//                             <SelectItem key={index} value={item}>
//                               {item}
//                             </SelectItem>
//                           ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </>
//               </FormControl>
//               <FormMessage className="text-xs" isErrorPresent />
//             </div>
//           </FormItem>
//         )
//       }}
//     />
//   )
// }



// React Imports
import React, { useEffect, useMemo, useState } from 'react'
import {
  UseFormReturn,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Config Import
import { cn } from '@/lib/utils'

// lucide-react Imports
import {
  Check,
  ChevronDown,
  Asterisk,
  X,
  Loader2,
} from 'lucide-react'

interface UserSelectProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  searchPlaceholder?: string
  emptyPlaceholder?: string
  mandatory?: boolean
  isFlexcol?: boolean
  hasDropdownValues?: boolean
  hasBadge?: boolean
  dropdownValue?: string[]
  maxHeight?: string
  isLabelVisible?: boolean
  getDropdown?: (search: string) => Promise<any>
  object?: boolean
}

type DropdownObject = {
  id?: string
  _id?: string
  name: string
  code?: string
  occupations?: string[]
  metadata?: Record<string, any>
}

type DropdownItem = string | DropdownObject

export default function UserSelect<FormType extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  searchPlaceholder = 'Search...',
  emptyPlaceholder = 'No result found',
  mandatory = false,
  isFlexcol = true,
  hasDropdownValues = false,
  hasBadge = false,
  dropdownValue = [],
  getDropdown,
  maxHeight = '',
  isLabelVisible = true,
  object = false,
}: UserSelectProps<FormType>) {
  const formContext = useFormContext<FormType>()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [data, setData] = useState<DropdownItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /*
  |--------------------------------------------------------------------------
  | Safe form helpers
  |--------------------------------------------------------------------------
  */

  const setValue =
    formContext?.setValue || form.setValue

  const watch =
    formContext?.watch || form.watch

  /*
  |--------------------------------------------------------------------------
  | Selected badge values
  |--------------------------------------------------------------------------
  */

  const watchedValue = watch(name)

const selectedSkills: string[] = useMemo(() => {
  if (!Array.isArray(watchedValue)) {
    return []
  }

  return (watchedValue as unknown[]).filter(
    (item: unknown): item is string =>
      typeof item === 'string',
  )
}, [watchedValue])

  /*
  |--------------------------------------------------------------------------
  | Normalize API response
  |--------------------------------------------------------------------------
  |
  | Supports:
  |
  | { data: [...] }
  |
  | { success: true, data: [...] }
  |
  | [...]
  |
  | { data: { data: [...] } }
  |
  | object=true:
  | [{ occupations: [...] }]
  |
  */

  const normalizeDropdownResponse = (
    response: any,
  ): DropdownItem[] => {
    if (!response) {
      return []
    }

    /*
     * Direct array
     */
    if (Array.isArray(response)) {
      return response
    }

    /*
     * Standard API:
     * {
     *   success: true,
     *   data: [...]
     * }
     */
    if (Array.isArray(response?.data)) {
      if (object) {
        const firstItem = response.data[0]

        if (
          firstItem &&
          Array.isArray(firstItem.occupations)
        ) {
          return firstItem.occupations
        }
      }

      return response.data
    }

    /*
     * Nested response:
     * {
     *   data: {
     *     data: [...]
     *   }
     * }
     */
    if (
      response?.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data
    }

    /*
     * occupations directly
     */
    if (
      Array.isArray(response?.occupations)
    ) {
      return response.occupations
    }

    console.warn(
      'UserSelect received invalid dropdown response:',
      response,
    )

    return []
  }

  /*
  |--------------------------------------------------------------------------
  | Fetch dropdown data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      /*
       * Static dropdown doesn't need API call.
       */
      if (!getDropdown) {
        if (isMounted) {
          setData([])
          setIsLoading(false)
        }

        return
      }

      try {
        setIsLoading(true)

        const response =
          await getDropdown(search)

        if (!isMounted) {
          return
        }

        const normalizedData =
          normalizeDropdownResponse(
            response,
          )

        setData(normalizedData)
      } catch (error) {
        console.error(
          `Failed to load dropdown "${label}":`,
          error,
        )

        /*
         * Critical:
         * Never leave data undefined.
         */
        if (isMounted) {
          setData([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [search, getDropdown, object, label])

  /*
  |--------------------------------------------------------------------------
  | Convert dropdown item to string value
  |--------------------------------------------------------------------------
  */

  const getItemValue = (
    item: DropdownItem,
  ): string => {
    if (typeof item === 'string') {
      return item
    }

    if (
      item &&
      typeof item.name === 'string'
    ) {
      return item.name
    }

    return ''
  }

  /*
  |--------------------------------------------------------------------------
  | Remove selected badge
  |--------------------------------------------------------------------------
  */

  const removeSkill = (
    skillToRemove: string,
  ) => {
    const updatedSkills =
      selectedSkills.filter(
        skill =>
          skill !== skillToRemove,
      )

    setValue(
      name,
      updatedSkills as any,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Always-safe render data
  |--------------------------------------------------------------------------
  */

  const safeData: DropdownItem[] =
    Array.isArray(data) ? data : []

  const safeDropdownValues =
    Array.isArray(dropdownValue)
      ? dropdownValue
      : []

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={`w-full flex ${
              isFlexcol
                ? 'flex-col'
                : 'items-start gap-3'
            } space-y-1.5`}
          >
            <FormLabel
              className={`flex gap-0.5 ${
                isLabelVisible
                  ? 'opacity-100'
                  : 'opacity-0'
              } ${
                !isFlexcol
                  ? 'pt-4'
                  : ''
              }`}
            >
              {label}

              {mandatory && (
                <Asterisk
                  strokeWidth={1.75}
                  className="w-3.5 h-3.5 block -m-[3px] text-primary"
                />
              )}
            </FormLabel>

            <div className="w-full flex flex-col gap-1">
              <FormControl>
                <>
                  {/*
                  |--------------------------------------------------------------------------
                  | API SEARCH DROPDOWN
                  |--------------------------------------------------------------------------
                  */}

                  {!hasDropdownValues &&
                    !hasBadge && (
                      <Popover
                        open={open}
                        onOpenChange={
                          setOpen
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
                              open
                            }
                            className={cn(
                              'w-full justify-between bg-white',
                              'hover:bg-white hover:text-accent-foreground',
                              'focus-visible:border-ring focus:ring-1',
                              'focus:ring-ring focus:ring-offset-0',
                              !field.value &&
                                'text-muted-foreground',
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? safeData.find(
                                    item =>
                                      getItemValue(
                                        item,
                                      ) ===
                                      field.value,
                                  )
                                  ? getItemValue(
                                      safeData.find(
                                        item =>
                                          getItemValue(
                                            item,
                                          ) ===
                                          field.value,
                                      )!,
                                    )
                                  : String(
                                      field.value,
                                    )
                                : placeholder}
                            </span>

                            {isLoading ? (
                              <Loader2 className="w-4 h-4 opacity-50 animate-spin" />
                            ) : (
                              <ChevronDown className="w-5 h-5 opacity-50" />
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
                          <Command
                            shouldFilter={
                              false
                            }
                          >
                            <CommandInput
                              placeholder={
                                searchPlaceholder
                              }
                              className="h-9"
                              value={search}
                              onValueChange={
                                setSearch
                              }
                            />

                            <CommandList>
                              {isLoading ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                  <Loader2 className="w-4 h-4 animate-spin" />

                                  Loading...
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>
                                    {
                                      emptyPlaceholder
                                    }
                                  </CommandEmpty>

                                  <CommandGroup>
                                    {safeData.map(
                                      (
                                        item,
                                        index,
                                      ) => {
                                        const value =
                                          getItemValue(
                                            item,
                                          )

                                        /*
                                         * Don't render invalid API items.
                                         */
                                        if (
                                          !value
                                        ) {
                                          return null
                                        }

                                        const itemKey =
                                          typeof item ===
                                          'object'
                                            ? item._id ||
                                              item.id ||
                                              `${value}-${index}`
                                            : `${value}-${index}`

                                        return (
                                          <CommandItem
                                            key={
                                              itemKey
                                            }
                                            value={
                                              value
                                            }
                                            onSelect={() => {
                                              setValue(
                                                name,
                                                value as any,
                                                {
                                                  shouldValidate:
                                                    true,
                                                  shouldDirty:
                                                    true,
                                                },
                                              )

                                              field.onChange(
                                                value,
                                              )

                                              setOpen(
                                                false,
                                              )
                                            }}
                                          >
                                            {
                                              value
                                            }

                                            <Check
                                              className={cn(
                                                'ml-auto',
                                                field.value ===
                                                  value
                                                  ? 'opacity-100'
                                                  : 'opacity-0',
                                              )}
                                            />
                                          </CommandItem>
                                        )
                                      },
                                    )}
                                  </CommandGroup>
                                </>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}

                  {/*
                  |--------------------------------------------------------------------------
                  | MULTI SELECT / BADGES
                  |--------------------------------------------------------------------------
                  */}

                  {hasBadge && (
                    <>
                      <Popover
                        open={open}
                        onOpenChange={
                          setOpen
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
                              open
                            }
                            className={cn(
                              'w-full justify-between bg-white',
                              'hover:bg-white hover:text-accent-foreground',
                              'focus-visible:border-ring focus:ring-1',
                              'focus:ring-ring focus:ring-offset-0',
                              !field.value &&
                                'text-muted-foreground',
                            )}
                          >
                            {
                              placeholder
                            }

                            {isLoading ? (
                              <Loader2 className="w-4 h-4 opacity-50 animate-spin" />
                            ) : (
                              <ChevronDown className="w-5 h-5 opacity-50" />
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
                          <Command
                            shouldFilter={
                              false
                            }
                          >
                            <CommandInput
                              placeholder={
                                searchPlaceholder
                              }
                              className="h-9"
                              value={search}
                              onValueChange={
                                setSearch
                              }
                            />

                            <CommandList>
                              {isLoading ? (
                                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                  <Loader2 className="w-4 h-4 animate-spin" />

                                  Loading...
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>
                                    {
                                      emptyPlaceholder
                                    }
                                  </CommandEmpty>

                                  <CommandGroup>
                                    {safeData.map(
                                      (
                                        item,
                                        index,
                                      ) => {
                                        const value =
                                          getItemValue(
                                            item,
                                          )

                                        if (
                                          !value
                                        ) {
                                          return null
                                        }

                                        const itemKey =
                                          typeof item ===
                                          'object'
                                            ? item._id ||
                                              item.id ||
                                              `${value}-${index}`
                                            : `${value}-${index}`

                                        return (
                                          <CommandItem
                                            key={
                                              itemKey
                                            }
                                            value={
                                              value
                                            }
                                            onSelect={() => {
                                              if (
                                                !selectedSkills.includes(
                                                  value,
                                                )
                                              ) {
                                                const updatedSkills =
                                                  [
                                                    ...selectedSkills,
                                                    value,
                                                  ]

                                                setValue(
                                                  name,
                                                  updatedSkills as any,
                                                  {
                                                    shouldValidate:
                                                      true,
                                                    shouldDirty:
                                                      true,
                                                  },
                                                )

                                                field.onChange(
                                                  updatedSkills,
                                                )
                                              }

                                              setOpen(
                                                false,
                                              )
                                            }}
                                          >
                                            {
                                              value
                                            }

                                            <Check
                                              className={cn(
                                                'ml-auto',
                                                selectedSkills.includes(
                                                  value,
                                                )
                                                  ? 'opacity-100'
                                                  : 'opacity-0',
                                              )}
                                            />
                                          </CommandItem>
                                        )
                                      },
                                    )}
                                  </CommandGroup>
                                </>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <div className="w-full pt-2">
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map(
                            skill => (
                              <Badge
                                key={
                                  skill
                                }
                                variant="secondary"
                                className="px-2.5 py-1 flex items-center text-primary-foreground border-primary bg-primary hover:bg-primary/90 gap-2"
                              >
                                {
                                  skill
                                }

                                <X
                                  className="h-4 w-4 cursor-pointer"
                                  onClick={event => {
                                    event.preventDefault()
                                    event.stopPropagation()

                                    removeSkill(
                                      skill,
                                    )
                                  }}
                                />
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/*
                  |--------------------------------------------------------------------------
                  | STATIC DROPDOWN
                  |--------------------------------------------------------------------------
                  */}

                  {hasDropdownValues &&
                    !hasBadge && (
                      <Select
                        onValueChange={
                          field.onChange
                        }
                        value={
                          typeof field.value ===
                          'string'
                            ? field.value
                            : ''
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            'user-input hover:bg-card hover:text-accent-foreground',
                            !field.value &&
                              'text-muted-foreground',
                          )}
                          id={String(
                            name,
                          )}
                        >
                          <SelectValue
                            placeholder={
                              placeholder
                            }
                          />
                        </SelectTrigger>

                        <SelectContent
                          className={`${maxHeight} p-0`}
                        >
                          <SelectGroup>
                            {safeDropdownValues.map(
                              (
                                item,
                                index,
                              ) => (
                                <SelectItem
                                  key={`${item}-${index}`}
                                  value={
                                    item
                                  }
                                >
                                  {
                                    item
                                  }
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                </>
              </FormControl>

              <FormMessage
                className="text-xs"
                isErrorPresent
              />
            </div>
          </FormItem>
        )
      }}
    />
  )
}