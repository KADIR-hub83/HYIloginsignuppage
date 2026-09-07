// React Imports
import React from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

// Next Imports
import Image, { StaticImageData } from 'next/image'

// Component Imports
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// lucide-react Imports
import { Asterisk } from 'lucide-react'

interface UserSocialLinkInputProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  mandatory?: boolean
  icon: StaticImageData | string
}

export default function UserSocialLinkInput<FormType extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  mandatory = false,
  icon,
}: UserSocialLinkInputProps<FormType>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full space-y-0">
          <FormLabel className="flex gap-0.5">
            {label}
            {mandatory && (
              <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
            )}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder={placeholder} {...field} className="pl-10" />
              <Image
                src={icon}
                alt="Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" isErrorPresent />
        </FormItem>
      )}
    />
  )
}
