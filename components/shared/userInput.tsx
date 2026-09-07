// React Imports
import React from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

// shadcn Imports
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// lucide-react Imports
import { Asterisk } from 'lucide-react'

interface UserInputProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  mandatory?: boolean
  isDisabled?: boolean
  type?: string
  isLabelVisible?: boolean
}

export default function UserInput<FormType extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  mandatory = false,
  isDisabled = false,
  type = 'string',
  isLabelVisible = true,
}: UserInputProps<FormType>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full space-y-1.5">
          <FormLabel
            className={`flex gap-0.5 ${isLabelVisible ? 'opacity-100' : 'hidden md:flex md:opacity-0'}`}
          >
            {label}
            {mandatory && (
              <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
            )}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} disabled={isDisabled} type={type} />
          </FormControl>
          <FormMessage className="text-xs" isErrorPresent />
        </FormItem>
      )}
    />
  )
}
