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
import UserDate from '@/components/shared/userDate'
import UserButton from '@/components/shared/userButton'
import UserFileUpload from '@/components/shared/userFileDropdown'

// Config Imports
import { talentApi } from '@/lib/services/api'
import { talentEducationFormSchema, talentCertificationFormSchema } from '@/lib/validations/auth'
import { TALENT_ONBOARDING_MESSAGES } from '@/lib/config/messages'

// Lucide-react Imports
import { CirclePlus, Trash2 } from 'lucide-react'

export default function Education({
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
    education: z.array(talentEducationFormSchema),
    certification: z.array(talentCertificationFormSchema),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education:
        savedData?.education?.length > 0
          ? savedData?.education?.map(
              (edu: {
                university: string
                degree: string
                specialization: string
                passingOutYear: string
              }) => {
                return {
                  university: edu.university || '',
                  degree: edu.degree || '',
                  specialization: edu.specialization || '',
                  passingOutYear: edu.passingOutYear || '',
                }
              }
            )
          : [
              {
                university: '',
                degree: '',
                specialization: '',
                passingOutYear: '',
              },
            ],
      certification:
        savedData?.certification?.length > 0
          ? savedData?.certification?.map(
              (certify: {
                title: string
                issuedBy: string
                issuedDate: string
                uploadCertificate: File
                website: string
              }) => {
                return {
                  title: certify.title || '',
                  issuedBy: certify.issuedBy || '',
                  issuedDate: certify.issuedDate || '',
                  uploadCertificate:
                    certify.uploadCertificate instanceof File ? certify.uploadCertificate : '',
                  certificateLink: certify.website || '',
                }
              }
            )
          : [
              {
                title: '',
                issuedBy: '',
                issuedDate: '',
                uploadCertificate: '',
                certificateLink: '',
              },
            ],
    },
  })

  const { control } = form

  const {
    fields: educationField,
    append: addEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  })

  // Key Skills Field Array
  const {
    fields: certificationFields,
    append: addCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: 'certification',
  })

  // Function to add a new work experience
  const handleAddEducation = () => {
    addEducation({
      university: '',
      degree: '',
      specialization: '',
      passingOutYear: '',
    })
  }

  // Function to add a new key skill
  const handleAddCertification = () => {
    addCertification({
      title: '',
      issuedBy: '',
      issuedDate: '',
      uploadCertificate: '',
      certificateLink: '',
    })
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const Index = Number(savedData.talentFormIndex) <= 3 ? '3' : savedData.talentFormIndex
    try {
      setIsLoading(true)
      const res = await talentApi.education({
        talentFormIndex: Index,
        education: data.education
          .map(edu => ({
            university: edu.university,
            degree: edu.degree,
            specialization: edu.specialization,
            passingOutYear: edu.passingOutYear,
          }))
          .filter(
            (edu, index) =>
              index === 0 ||
              [edu.university, edu.degree, edu.specialization, edu.passingOutYear].some(value =>
                value?.trim()
              )
          ),
        certification: data.certification.map(certify => ({
          title: certify.title || '',
          issuedBy: certify.issuedBy || '',
          issuedDate: certify.issuedDate || '',
          uploadCertificate: certify?.uploadCertificate || null,
          website: certify.certificateLink || '',
        })),
      })

      // console.log(res)

      toast({
        variant: 'default',
        ...TALENT_ONBOARDING_MESSAGES.AUTH.EDUCATIONDETAILS.SUCCESS,
        description: TALENT_ONBOARDING_MESSAGES.AUTH.EDUCATIONDETAILS.SUCCESS.description,
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
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-6">
              <section className="w-full flex justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Education</h2>
              </section>
              {educationField.map((field, index) => {
                return (
                  <div key={field.id} className="w-full space-y-5">
                    <section className="w-full flex items-center justify-center">
                      <div className="w-full flex flex-col items-center justify-center bg-background rounded-lg px-5 py-6 gap-2">
                        <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                          <UserSelect
                            form={form}
                            label="University/Institute"
                            name={`education.${index}.university`}
                            placeholder="Enter University/Institute Name"
                            getDropdown={talentApi.getUniversity}
                            searchPlaceholder="Enter University/Institute"
                            emptyPlaceholder="No University/Institute found"
                            maxHeight="h-56"
                            mandatory
                          />
                          <UserInput
                            form={form}
                            label="Degree"
                            name={`education.${index}.degree`}
                            placeholder="Enter Degree"
                            mandatory
                          />
                        </div>
                        <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                          <UserSelect
                            form={form}
                            label="Specialization"
                            name={`education.${index}.specialization`}
                            placeholder="Select Specialization"
                            getDropdown={talentApi.getDegree}
                            searchPlaceholder="Enter Specialization"
                            emptyPlaceholder="No specialization found"
                            maxHeight="h-56"
                            mandatory
                          />

                          <UserDate
                            form={form}
                            label="Year of pass out"
                            name={`education.${index}.passingOutYear`}
                            placeholder="DD/MM/YYYY"
                            mandatory
                          />
                        </div>
                        <div className={`w-full flex flex-row-reverse ${index === 0 && 'hidden'}`}>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeEducation(index)}
                              className="w-fit h-8 flex gap-1.5"
                            >
                              <Trash2 size={20} strokeWidth={1.25} />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </section>
                    {educationField.length !== 1 &&
                      index >= 0 &&
                      index !== educationField.length - 1 && (
                        <div>
                          <Separator />
                        </div>
                      )}
                    {index === educationField.length - 1 && (
                      <div className="w-full flex items-start">
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => handleAddEducation()}
                          className="flex bg-white text-foreground px-0 py-0 gap-2 hover:bg-popover"
                        >
                          <CirclePlus
                            size={32}
                            strokeWidth={0.75}
                            className="text-muted-foreground bg-white"
                          />
                          <span className="text-sm font-semibold text-primary">Add Education</span>
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <Card className="w-full flex flex-col items-center justify-center gap-10">
            <CardContent className="w-full flex flex-col items-center text-card-foreground p-6 gap-6">
              <section className="w-full flex justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Certifications</h2>
              </section>
              {certificationFields.map((field, index) => {
                return (
                  <div key={field.id} className="w-full space-y-5">
                    <section className="w-full flex items-center justify-center">
                      <div className="w-full flex flex-col items-center justify-center bg-background rounded-lg px-5 py-6 gap-2">
                        <div className="w-full flex">
                          <UserInput
                            form={form}
                            label="Title"
                            name={`certification.${index}.title`}
                            placeholder="Enter title"
                          />
                        </div>
                        <div className="w-full flex flex-col gap-2 md:flex-row md:gap-6">
                          <UserInput
                            form={form}
                            label="Issued by"
                            name={`certification.${index}.issuedBy`}
                            placeholder="Issued by"
                          />
                          <UserDate
                            form={form}
                            label="Issued Date"
                            name={`certification.${index}.issuedDate`}
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <div className="w-full">
                          <UserFileUpload
                            form={form}
                            label="Upload your Certificate"
                            name={`certification.${index}.uploadCertificate`}
                            savedFile={
                              savedData?.certification?.[index]?.uploadCertificate instanceof File
                                ? URL.createObjectURL(
                                    savedData?.certification?.[index]?.uploadCertificate
                                  )
                                : savedData?.certification?.[index]?.uploadCertificate
                            }
                            isCard={false}
                          />
                        </div>
                        <div className="w-full flex">
                          <UserInput
                            form={form}
                            label="Certification Link"
                            name={`certification.${index}.certificateLink`}
                            placeholder="Enter Certification Link"
                          />
                        </div>
                        <div className={`w-full flex flex-row-reverse ${index === 0 && 'hidden'}`}>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeCertification(index)}
                              className="w-fit h-8 flex gap-1.5"
                            >
                              <Trash2 size={20} strokeWidth={1.25} />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </section>
                    {certificationFields.length !== 1 &&
                      index >= 0 &&
                      index !== certificationFields.length - 1 && (
                        <div className="">
                          <Separator />
                        </div>
                      )}
                    {index === certificationFields.length - 1 && (
                      <div className="w-full flex items-start">
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => handleAddCertification()}
                          className="flex bg-white text-foreground px-0 py-0 gap-2 hover:bg-popover"
                        >
                          <CirclePlus
                            size={32}
                            strokeWidth={0.75}
                            className="text-muted-foreground bg-white"
                          />
                          <span className="text-sm font-semibold text-primary">
                            Add Certifications
                          </span>
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
                Continue
              </UserButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
