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
import { Separator } from '@/components/ui/separator'

// Components Imports
import UserInput from '@/components/shared/userInput'
import UserSelect from '@/components/shared/userSelect'
import UserSummary from '@/components/shared/userSummary'
import UserButton from '@/components/shared/userButton'
import UserSocialLinkInput from '@/components/shared/userSocialLinkInput'

// Config Imports
import { talentApi } from '@/lib/services/api'
import { talentLanguagesFormSchema, talentProjectsFormSchema } from '@/lib/validations/auth'
import { TALENT_ONBOARDING_MESSAGES } from '@/lib/config/messages'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'

// Lucide-react Imports
import { CirclePlus, Trash2, PlusIcon, Asterisk } from 'lucide-react'

// Image Import
import projectIcon from '@/components/assets/talent-onboarding/project.svg'

export default function AdditionalDetail({
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
    languages: z.array(talentLanguagesFormSchema),
    projects: z.array(talentProjectsFormSchema),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      languages:
        savedData?.languages?.length > 0
          ? savedData?.languages?.map((lang: { language: string; proficiency: string }) => {
              return {
                language: lang.language || '',
                proficiency: lang.proficiency || '',
              }
            })
          : [
              {
                language: '',
                proficiency: '',
              },
            ],
      projects:
        savedData?.projects?.length > 0
          ? savedData?.projects?.map(
              (project: {
                projectTitle: string
                year: string
                projectLink: string
                technicalSkillUsed: []
                projectDescription: string
              }) => {
                return {
                  title: project.projectTitle,
                  year: project.year,
                  projectLink: project.projectLink,
                  technicalSkillUsed: project.technicalSkillUsed,
                  description: project.projectDescription,
                }
              }
            )
          : [
              {
                title: '',
                year: '',
                projectLink: '',
                technicalSkillUsed: [],
                description: '',
              },
            ],
    },
  })

  const { control, watch } = form

  const {
    fields: languageField,
    append: addLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: 'languages',
  })

  // Key Skills Field Array
  const {
    fields: projectsFields,
    append: addProjects,
    remove: removeProjects,
  } = useFieldArray({
    control,
    name: 'projects',
  })

  // Function to add a new work experience
  const handleAddLanguage = () => {
    addLanguage({
      language: '',
      proficiency: '',
    })
  }

  // Function to add a new key skill
  const handleAddProject = () => {
    addProjects({
      title: '',
      year: '',
      projectLink: '',
      technicalSkillUsed: [],
      description: '',
    })
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const Index = Number(savedData?.talentFormIndex) <= 4 ? '4' : savedData?.talentFormIndex
      setIsLoading(true)
      type data = {
        languages: [{ language: string; proficiency: string }]
        projects: [
          {
            title: string
            year: string
            projectLink: string
            technicalSkillUsed: string[]
            description: string
          },
        ]
      }

      const updatedData: data = form.getValues()

      const res = await talentApi.additionalDetails({
        talentOnboadCompleted: true,
        talentFormIndex: Index,
        languages: updatedData.languages.map(lang => ({
          language: lang.language,
          proficiency: lang.proficiency,
        })),
        projects: updatedData.projects
          .map(project => ({
            projectTitle: project.title?.trim() || '',
            year: project.year || '',
            projectLink: project.projectLink?.trim() || '',
            technicalSkillUsed: project.technicalSkillUsed || [],
            projectDescription: project.description?.trim() || '',
          }))
          .filter(
            project =>
              project.projectTitle ||
              project.year ||
              project.projectLink ||
              project.technicalSkillUsed.length ||
              project.projectDescription
          ),
      })

      toast({
        variant: 'default',
        ...TALENT_ONBOARDING_MESSAGES.AUTH.ADDITIONALDETAILS.SUCCESS,
        description: TALENT_ONBOARDING_MESSAGES.AUTH.ADDITIONALDETAILS.SUCCESS.description,
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
          <Card className="w-full flex flex-col items-center justify-center gap-10">
            {/* -------------Personal Information------------- */}
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-2">
              <section className="w-full flex justify-between pb-4">
                <h2 className="flex text-lg font-semibold text-card-foreground">
                  Languages{' '}
                  <Asterisk strokeWidth={1.75} className="w-4 h-4 block -m-[2px] text-primary" />
                </h2>
              </section>
              {languageField.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className={`w-full flex flex-col items-center gap-2 md:flex-row md:gap-6`}
                  >
                    <UserSelect
                      form={form}
                      label="Language"
                      name={`languages.${index}.language`}
                      placeholder="Select language"
                      getDropdown={talentApi.getLanguages}
                      searchPlaceholder="Enter language"
                      emptyPlaceholder="No language found"
                      mandatory
                      maxHeight="h-56"
                    />

                    <UserSelect
                      form={form}
                      label="Proficiency"
                      name={`languages.${index}.proficiency`}
                      placeholder="Enter Proficiency"
                      mandatory
                      hasDropdownValues
                      dropdownValue={dropdownValue.proficiency}
                    />

                    <div
                      className={`w-full h-full flex items-center justify-between md:w-fit md:justify-center mb-1.5 gap-4`}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleAddLanguage()}
                        className="p-1 hover:bg-card"
                      >
                        <span className="hidden md:flex">
                          <PlusIcon size={24} strokeWidth={1.0} />
                        </span>
                        <span className="flex items-center gap-2 md:hidden">
                          <CirclePlus size={24} strokeWidth={1.0} />
                          <span className="text-primary">Add Language</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={languageField.length === 1}
                        onClick={() => removeLanguage(index)}
                        className="p-1 hover:bg-card"
                      >
                        <Trash2 size={20} strokeWidth={1.0} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <Card className="w-full flex flex-col items-center justify-center gap-10">
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-6">
              <section className="w-full flex justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Projects</h2>
              </section>
              {projectsFields.map((field, index) => {
                return (
                  <div key={field.id} className="w-full space-y-5">
                    <section className="w-full flex items-center justify-center">
                      <div className="w-full flex flex-col items-center justify-center bg-background rounded-lg px-5 py-6 gap-2">
                        <div className="w-full flex">
                          <UserInput
                            form={form}
                            label="Project Title"
                            name={`projects.${index}.title`}
                            placeholder="Enter Project title"
                          />
                        </div>
                        <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                          <UserSelect
                            form={form}
                            label="Year"
                            name={`projects.${index}.year`}
                            placeholder="2024"
                            hasDropdownValues
                            dropdownValue={dropdownValue.generateYears(
                              1975,
                              new Date().getFullYear()
                            )}
                            maxHeight="h-56"
                          />
                          <UserSocialLinkInput
                            form={form}
                            label="Project Link"
                            name={`projects.${index}.projectLink`}
                            placeholder="Project URL"
                            icon={projectIcon}
                          />
                        </div>
                        <div className="w-full flex">
                          <UserSelect
                            form={form}
                            label="Technical Skills"
                            name={`projects.${index}.technicalSkillUsed`}
                            placeholder="Select Technical Skills"
                            getDropdown={talentApi.getSkill}
                            searchPlaceholder="Enter skills"
                            emptyPlaceholder="No skills found"
                            maxHeight="h-56"
                            hasBadge
                          />
                        </div>
                        <div className="w-full">
                          <UserSummary
                            form={form}
                            label="Description"
                            name={`projects.${index}.description`}
                            placeholder="Describe your experience and the skills you used."
                            charactersLength={2000}
                          />
                        </div>
                        <div className={`w-full flex flex-row-reverse ${index === 0 && 'hidden'}`}>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeProjects(index)}
                              className="w-fit h-8 flex gap-1.5"
                            >
                              <Trash2 size={20} strokeWidth={1.25} />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </section>
                    {projectsFields.length !== 1 &&
                      index >= 0 &&
                      index !== projectsFields.length - 1 && (
                        <div className="">
                          <Separator />
                        </div>
                      )}
                    {index === projectsFields.length - 1 && (
                      <div className="w-full flex items-start">
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => handleAddProject()}
                          className="flex bg-white text-foreground px-0 py-0 gap-2 hover:bg-popover"
                        >
                          <CirclePlus
                            size={32}
                            strokeWidth={0.75}
                            className="text-muted-foreground bg-white"
                          />
                          <span className="text-sm font-semibold text-primary">Add Projects</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <div className="flex justify-between pt-7 md:pb-10">
            <Button onClick={onPreviousClick} disabled={currentStep === 1} variant="outline">
              Previous
            </Button>
            <div className="w-fit">
              <UserButton type="submit" buttonText="updating" isLoading={isLoading} isFormButton>
                Submit
              </UserButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
