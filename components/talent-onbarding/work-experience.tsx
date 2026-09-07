'use client'

// React Imports
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

// Zod Imports
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Shadcn Imports
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

// Components Imports
import UserInput from '@/components/shared/userInput'
import UserSelect from '@/components/shared/userSelect'
import UserSummary from '@/components/shared/userSummary'
import UserButton from '@/components/shared/userButton'
import UserMultiSelect from '@/components/shared/userMultiSelect'

// Config Imports
import { talentApi } from '@/lib/services/api'
import { talentWorkExperienceFormSchema, preferencesSchema } from '@/lib/validations/auth'
import { TALENT_ONBOARDING_MESSAGES } from '@/lib/config/messages'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'

// Lucide-react Imports
import { CirclePlus, Trash2, Asterisk, PlusIcon } from 'lucide-react'

export default function WorkExperience({
  onComplete,
  onPreviousClick,
  currentStep,
  savedData,
}: {
  savedData: any
  currentStep: number
  onComplete: (data: any) => void
  onPreviousClick: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formSchema = z.object({
    experiences: z.array(talentWorkExperienceFormSchema),
    keySkills: z.array(
      z.object({
        skill: z.string().min(1, 'Skill is required'),
        experienceYear: z.string().min(1, 'Year is required'),
        experienceMonth: z.string().min(1, 'Month is required'),
      })
    ),
    softSkills: z.array(z.string()).optional(),
    preferences: preferencesSchema,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experiences:
        savedData?.experience?.length > 0
          ? savedData?.experience?.map(
              (exp: {
                companyName: string
                designation: string
                workSince: string
                workTill: string
                currentlyWorking: boolean
                description: string
              }) => {
                const workSince = exp?.workSince.split('-')
                let workTill
                if (exp?.workTill === 'present') {
                  workTill = ['', '']
                } else {
                  workTill = exp?.workTill.split('-')
                }

                return {
                  companyName: exp.companyName || '',
                  designation: exp.designation || '',
                  workingSinceYear: workSince[1] || '',
                  workingSinceMonth: workSince[0] || '',
                  workingTillYear: workTill[1] || '',
                  workingTillMonth: workTill[0] || '',
                  currentlyWorking: exp.currentlyWorking || false,
                  description: exp.description || '',
                }
              }
            )
          : [
              {
                companyName: '',
                designation: '',
                workingSinceYear: '',
                workingSinceMonth: '',
                workingTillYear: '',
                workingTillMonth: '',
                currentlyWorking: false,
                description: '',
              },
            ],
      keySkills:
        savedData?.technicalSkills?.length > 0
          ? savedData?.technicalSkills?.map((keySkill: { skill: string; experience: string }) => {
              const experience = keySkill?.experience.split('.')
              return {
                skill: keySkill.skill || '',
                experienceYear: experience[0] || '',
                experienceMonth: experience[1] || '',
              }
            })
          : [
              {
                skill: '',
                experienceYear: '',
                experienceMonth: '',
              },
            ],
      softSkills: savedData?.otherSkills || [],
      preferences: {
        employmentPreference: savedData?.preference?.employmentPreference || '',
        hoursPerWeek: savedData?.preference?.hoursPerWeek || '',
        desiredSalary: {
          currency: savedData?.preference?.desiredSalary?.currency || '',
          price: savedData?.preference?.desiredSalary?.price || '',
        },
        availableHours: {
          from: savedData?.preference?.availableHours?.from || '',
          to: savedData?.preference?.availableHours?.to || '',
        },
      },
    },
  })

  const { control, watch } = form

  const {
    fields: experienceFields,
    append: addExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experiences',
  })

  // Key Skills Field Array
  const {
    fields: skillFields,
    append: addSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'keySkills',
  })

  // Function to add a new work experience
  const handleAddExperience = () => {
    addExperience({
      companyName: '',
      designation: '',
      workingSinceYear: '',
      workingSinceMonth: '',
      workingTillYear: '',
      workingTillMonth: '',
      currentlyWorking: false,
      description: '',
    })
  }

  // Function to add a new key skill
  const handleAddSkill = () => {
    addSkill({
      skill: '',
      experienceYear: '',
      experienceMonth: '',
    })
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const Index = Number(savedData?.talentFormIndex) <= 2 ? '2' : savedData?.talentFormIndex
    const currentMonth = new Date().toLocaleString('default', { month: 'short' })
    const currentYear = new Date().getFullYear()
    try {
      setIsLoading(true)
      const res = await talentApi.workExp({
        talentFormIndex: Index,
        experience: data.experiences.map(exp => ({
          companyName: exp.companyName,
          designation: exp.designation,
          workSince: `${exp.workingSinceMonth}-${exp.workingSinceYear}`,
          workTill: exp.currentlyWorking
            ? 'present'
            : `${exp.workingTillMonth}-${exp.workingTillYear}`,
          description: exp.description,
          currentlyWorking: exp.currentlyWorking,
          totalYearsOfExperience: Number(
            (
              (((Number(exp.workingTillYear) || currentYear) - Number(exp.workingSinceYear)) * 12 +
                ((dropdownValue.monthsToNumber[exp.workingTillMonth || currentMonth] || 0) -
                  (dropdownValue.monthsToNumber[exp.workingSinceMonth] || 0) +
                  1)) /
              12
            ).toFixed(1)
          ),
        })),
        technicalSkills: data.keySkills.map(skill => ({
          skill: skill.skill,
          experience: `${skill.experienceYear}.${skill.experienceMonth}`,
        })),
        otherSkills: data.softSkills as [],
        preference: {
          employmentPreference: data.preferences.employmentPreference,
          hoursPerWeek: data.preferences.hoursPerWeek,
          desiredSalary: {
            currency: data.preferences.desiredSalary.currency,
            price: data.preferences.desiredSalary.price,
          },
          availableHours: data.preferences.availableHours,
        },
      })

      toast({
        variant: 'default',
        ...TALENT_ONBOARDING_MESSAGES.AUTH.WORKDETAILS.SUCCESS,
        description: TALENT_ONBOARDING_MESSAGES.AUTH.WORKDETAILS.SUCCESS.description,
        // className: 'w-fit fixed top-[72px] right-0',
      })
      if (res.success) {
        onComplete(data)
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        ...TALENT_ONBOARDING_MESSAGES.AUTH.WORKDETAILS.ERROR,
        description:
          error.response?.data?.message ||
          TALENT_ONBOARDING_MESSAGES.AUTH.WORKDETAILS.ERROR.description,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Card className="w-full flex flex-col items-center justify-center border-0 gap-10">
            <CardContent className="w-full flex flex-col items-center rounded-md border bg-card text-card-foreground gap-6 p-6">
              <section className="w-full flex justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Work Experience</h2>
              </section>

              {experienceFields.map((field, index) => {
                const currentlyWorking = watch(`experiences.${index}.currentlyWorking`)
                return (
                  <div key={field.id} className="w-full space-y-5">
                    <div className="w-full flex flex-col items-center justify-center bg-background rounded-lg px-5 py-6 gap-2">
                      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                        <UserInput
                          form={form}
                          label="Company Name"
                          name={`experiences.${index}.companyName`}
                          placeholder="Enter Company Name"
                          mandatory
                        />
                        <UserSelect
                          form={form}
                          label="Designation"
                          name={`experiences.${index}.designation`}
                          placeholder="Enter Designation"
                          searchPlaceholder="Enter Designation"
                          emptyPlaceholder="No designation found"
                          getDropdown={talentApi.getDesignation}
                          object
                          mandatory
                        />
                      </div>

                      <div className="w-full flex flex-col items-end gap-2 md:flex-row md:gap-6">
                        <div className="w-full flex items-end gap-6">
                          <UserSelect
                            form={form}
                            label="Working Since"
                            name={`experiences.${index}.workingSinceYear`}
                            placeholder="2023"
                            mandatory
                            hasDropdownValues
                            dropdownValue={dropdownValue.generateYears(
                              1975,
                              new Date().getFullYear()
                            )}
                            maxHeight="h-56"
                          />
                          <UserSelect
                            form={form}
                            label=" "
                            name={`experiences.${index}.workingSinceMonth`}
                            placeholder="Feb"
                            hasDropdownValues
                            dropdownValue={dropdownValue.months}
                            maxHeight="h-56"
                          />
                        </div>
                        <div className="w-full flex items-end gap-6">
                          {!currentlyWorking && (
                            <>
                              <UserSelect
                                form={form}
                                label="Working Till"
                                name={`experiences.${index}.workingTillYear`}
                                placeholder="2025"
                                mandatory
                                hasDropdownValues
                                dropdownValue={dropdownValue.generateYears(
                                  1975,
                                  new Date().getFullYear()
                                )}
                                maxHeight="h-56"
                              />
                              <UserSelect
                                form={form}
                                label=" "
                                name={`experiences.${index}.workingTillMonth`}
                                placeholder="Jan"
                                hasDropdownValues
                                dropdownValue={dropdownValue.months}
                                maxHeight="h-56"
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <UserSummary
                        form={form}
                        label="Profile Summary"
                        name={`experiences.${index}.description`}
                        placeholder="Describe your experience and the skills you used."
                        charactersLength={2000}
                        mandatory
                      />

                      <div className="w-full flex flex-col items-start gap-2 md:flex-row md:justify-between md:gap-0">
                        <div className="w-full flex items-center gap-2">
                          <Checkbox
                            checked={currentlyWorking}
                            onCheckedChange={checked =>
                              form.setValue(
                                `experiences.${index}.currentlyWorking`,
                                checked as boolean
                              )
                            }
                          />
                          <label className="text-sm">I'm currently working here</label>
                        </div>

                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeExperience(index)}
                            className="w-fit flex px-0 gap-1.5 md:px-4"
                          >
                            <Trash2 size={20} strokeWidth={1.25} />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    {index !== experienceFields.length - 1 && (
                      <div>
                        <Separator />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Add Work Experience Button */}
              <div className="w-full flex items-start">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => handleAddExperience()}
                  className="flex bg-white text-foreground px-0 py-0 gap-2 hover:bg-popover"
                >
                  <CirclePlus size={32} strokeWidth={0.75} className="text-muted-foreground" />
                  <span className="text-sm font-semibold text-primary">Add Work Experience</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full flex flex-col items-center justify-center border-0 gap-10">
            <CardContent className="w-full flex flex-col items-center rounded-md border bg-card text-card-foreground p-6 gap-2">
              <section className="w-full flex justify-between pb-4">
                <h2 className="text-lg font-semibold text-card-foreground">Skills</h2>
              </section>
              {skillFields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="w-full flex flex-col items-center gap-2 md:flex-row md:gap-6"
                  >
                    <div className="w-full flex flex-col items-center gap-2 md:flex-row md:gap-6">
                      <div className="w-full flex items-center md:w-2/5">
                        <UserSelect
                          form={form}
                          label="Key Skills"
                          name={`keySkills.${index}.skill`}
                          placeholder="Java"
                          searchPlaceholder="Enter skill"
                          emptyPlaceholder="No skill found"
                          getDropdown={talentApi.getSkills}
                          mandatory
                        />
                      </div>
                      <div className="w-full flex items-center gap-2 md:w-3/5 md:gap-6">
                        <UserSelect
                          form={form}
                          label="Working Since"
                          name={`keySkills.${index}.experienceYear`}
                          placeholder="2 years"
                          mandatory
                          hasDropdownValues
                          dropdownValue={dropdownValue.generateNumber(1, 30)}
                          maxHeight="h-56"
                        />
                        <UserSelect
                          form={form}
                          label="Month"
                          name={`keySkills.${index}.experienceMonth`}
                          placeholder="0 months"
                          hasDropdownValues
                          dropdownValue={dropdownValue.generateNumber(0, 11)}
                          maxHeight="h-56"
                          isLabelVisible={false}
                        />
                      </div>

                      <div className="w-full flex items-center justify-between md:w-fit md:justify-normal md:gap-6">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleAddSkill()}
                          className="flex px-0 py-0 rounded-full hover:bg-card"
                        >
                          <span className="hidden md:flex">
                            <PlusIcon size={24} strokeWidth={1.0} />
                          </span>
                          <span className="flex items-center gap-2 md:hidden">
                            <CirclePlus size={24} strokeWidth={1.0} />
                            <span className="text-primary">Add Skill</span>
                          </span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={skillFields.length === 1}
                          onClick={() => removeSkill(index)}
                          className="w-fit px-1 py-1 hover:bg-card"
                        >
                          <Trash2 size={20} strokeWidth={1.0} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="w-full py-4 md:py-1">
                <Separator />
              </div>

              <UserMultiSelect
                form={form}
                label="Soft Skills"
                name="softSkills"
                placeholder="Select Soft Skills"
              />
            </CardContent>
          </Card>
          <Card className="w-full flex flex-col items-center justify-center border-0 gap-10">
            <CardContent className="w-full flex flex-col items-center rounded-md border bg-card text-card-foreground p-6 pb-10 gap-2">
              <section className="w-full flex justify-between pb-4">
                <h2 className="text-lg font-semibold text-card-foreground">Preferences</h2>
              </section>
              <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                <UserSelect
                  form={form}
                  label="Employment Preference"
                  name="preferences.employmentPreference"
                  placeholder="Enter employment preference"
                  mandatory
                  hasDropdownValues
                  dropdownValue={['Part-Time', 'Full-Time']}
                />
                <UserInput
                  form={form}
                  label="Number of hours available per week"
                  name="preferences.hoursPerWeek"
                  placeholder="10"
                  type="number"
                  mandatory
                />
              </div>
              <div className="w-full flex flex-col gap-2 lg:flex-row lg:gap-6">
                <div className="w-full flex flex-col items-end gap-2 md:flex-row md:gap-6">
                  <UserSelect
                    form={form}
                    label="Desired salary per hour"
                    name="preferences.desiredSalary.currency"
                    placeholder="Indian Rupees (₹)"
                    hasDropdownValues
                    dropdownValue={['United States Dollar ($)', 'Indian Rupees (₹)']}
                    mandatory
                  />
                  <UserInput
                    form={form}
                    label="price"
                    name="preferences.desiredSalary.price"
                    placeholder="40"
                    type="number"
                    isLabelVisible={false}
                  />
                </div>
                <div className="w-full flex flex-col">
                  <h3 className="flex text-sm font-medium text-card-foreground gap-0.5">
                    Available to work{' '}
                    <Asterisk
                      strokeWidth={1.75}
                      className="w-3.5 h-3.5 block -m-[2px] text-primary"
                    />
                  </h3>
                  <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                    <UserSelect
                      form={form}
                      label="From"
                      name="preferences.availableHours.from"
                      placeholder="10:00 AM"
                      hasDropdownValues
                      dropdownValue={dropdownValue.generateHours()}
                      maxHeight="h-56"
                      isFlexcol={false}
                    />
                    <UserSelect
                      form={form}
                      label="To"
                      name="preferences.availableHours.to"
                      placeholder="10:00 PM"
                      hasDropdownValues
                      dropdownValue={dropdownValue.generateHours()}
                      maxHeight="h-56"
                      isFlexcol={false}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-7 md:pb-10">
          <Button onClick={onPreviousClick} disabled={currentStep === 1} variant="outline">
            Previous
          </Button>
          <div className="w-fit">
            <UserButton type="submit" buttonText="updating" isLoading={isLoading} isFormButton>
              Continue
            </UserButton>
          </div>
        </div>
      </form>
    </Form>
  )
}
