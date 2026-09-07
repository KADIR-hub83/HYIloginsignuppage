// React Imports
import React from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

// shadcn Imports
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// lucide-react Imports
import { Asterisk } from 'lucide-react'

interface UserSummaryProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  mandatory?: boolean
  charactersLength?: number
}

export default function UserSummary<FormType extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  mandatory = false,
  charactersLength = 480,
}: UserSummaryProps<FormType>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full space-y-1.5">
          <FormLabel className="flex gap-0.5">
            {label}
            {mandatory && (
              <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
            )}
          </FormLabel>
          <FormControl>
            <>
              <Textarea
                placeholder={placeholder}
                className="min-h-[100px] bg-white focus-visible:ring-1 focus-visible:ring-offset-0 px-3.5 py-3"
                {...field}
              />
              <span className="text-xs font-normal text-muted-foreground pt-1.5">
                {field?.value?.trim().length || 0} / {charactersLength} Characters
              </span>
            </>
          </FormControl>
          <FormMessage className="text-xs" isErrorPresent />
        </FormItem>
      )}
    />
  )
}
