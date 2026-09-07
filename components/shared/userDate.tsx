// React Imports
import React, { useEffect, useState } from 'react'
import { UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form'
import { isValid, format } from 'date-fns'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Config Import
import { cn } from '@/lib/utils'

// lucide-react Imports
import { CalendarIcon, Asterisk } from 'lucide-react'

interface UserDateProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  mandatory?: boolean
  savedDate?: string
}

export default function UserDate<FormType extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  mandatory = false,
  savedDate,
}: UserDateProps<FormType>) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (savedDate) {
      try {
        const parsedDate = new Date(savedDate)

        if (isValid(parsedDate)) {
          form.setValue(
            name,
            format(parsedDate, 'yyyy/MM/dd') as PathValue<FormType, Path<FormType>>
          )
          form.trigger(name)
        } else {
          console.warn('Invalid savedDate:', savedDate)
        }
      } catch (error) {
        console.error('Error parsing savedDate:', error)
      }
    }
  }, [savedDate, name])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col space-y-1.5">
          <FormLabel className="flex gap-0.5">
            {label}
            {mandatory && (
              <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
            )}
          </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-expanded={open}
                  className={cn(
                    'font-normal justify-between text-left bg-white hover:bg-white hover:text-accent-foreground focus-visible:border-ring focus:ring-1 focus:ring-ring',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), 'dd/MM/yyyy')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={date || (field.value ? new Date(field.value) : undefined)}
                  defaultMonth={date || (field.value ? new Date(field.value) : undefined)}
                  onSelect={selectedDate => {
                    if (selectedDate) {
                      const formattedDate = format(selectedDate, 'yyyy/MM/dd')
                      field.onChange(formattedDate)
                      setDate(selectedDate)
                    } else {
                      field.onChange('')
                      setDate(undefined)
                    }
                    setOpen(false)
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage className="text-xs" isErrorPresent />
        </FormItem>
      )}
    />
  )
}
