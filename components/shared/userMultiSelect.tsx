import { useState } from 'react'
import { UseFormReturn, FieldValues, Path, useFormContext } from 'react-hook-form'

// shadcn Imports
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// lucide-react Imports
import { X, Asterisk } from 'lucide-react'
import { Button } from '../ui/button'

interface UserMultiSelectProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  placeholder: string
  mandatory?: boolean
}

export default function UserMultiSelect<FormType extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  mandatory = false,
}: UserMultiSelectProps<FormType>) {
  const { setValue, watch } = useFormContext()
  const selectedSkills: string[] = watch(name) || []
  const [inputValue, setInputValue] = useState('')

  const handleAddSkill = () => {
    if (inputValue.trim() && !selectedSkills.includes(inputValue.trim())) {
      const newSkills = [...selectedSkills, inputValue.trim()]
      setValue(name as Path<FormType>, newSkills as any)
    }
    setInputValue('') // Clear input after adding
  }

  const removeSkill = (skill: string) => {
    setValue(name as Path<FormType>, selectedSkills.filter(s => s !== skill) as any)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => {
        return (
          <FormItem className="w-full space-y-1.5">
            <FormLabel className="flex gap-0.5">
              {label}
              {mandatory && (
                <Asterisk strokeWidth={1.75} className="w-3.5 h-3.5 block -m-[3px] text-primary" />
              )}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button
                  type="button"
                  className="absolute top-2 right-2 w-fit h-6 text-xs"
                  onClick={handleAddSkill}
                >
                  Add Skill
                </Button>
                <div className="w-full pt-2">
                  {/* Display Selected Skills as Badges */}
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => {
                      return (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-2.5 py-1 flex items-center text-primary-foreground border-primary bg-primary hover:bg-primary/90 gap-2"
                        >
                          {skill}
                          <X
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage className="text-xs" isErrorPresent />
          </FormItem>
        )
      }}
    />
  )
}
