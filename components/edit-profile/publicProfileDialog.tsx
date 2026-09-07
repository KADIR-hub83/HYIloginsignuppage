'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AvailableToWorkIcon from '@/components/assets/edit-profile/available-to-work.svg'
import DesiredSalaryIcon from '@/components/assets/edit-profile/desired-salary.svg'
import EmploymentPreferenceIcon from '@/components/assets/edit-profile/employement-preference.svg'
import YearsOfExperienceIcon from '@/components/assets/edit-profile/years-of-experience.svg'
import { dropdownValue } from '@/lib/helper/dropdownValueGenerator'
import LinkIcon from '@/components/assets/edit-profile/link.svg'

type TechnicalSkill = {
  skill: string
  experience: string
}

type Experience = {
  companyName: string
  workSince: string
  workTill: string
  designation: string
  currentlyWorking: boolean
  description: string
}

type Preference = {
  employmentPreference: string
  hoursPerWeek: number
  desiredSalary: {
    currency: string
    price: number
  }
  availableHours: {
    from: string
    to: string
  }
}

type Project = {
  projectTitle: string
  year: string
  projectLink: string
  technicalSkillUsed: string[]
  projectDescription: string
}

type Education = {
  university: string
  degree: string
  specialization: string
  passingOutYear: string
}

type Certification = {
  title: string
  issuedBy: string
  issuedDate: string
  website: string
  uploadCertificate: File[] | string
}

type Language = {
  language: string
  proficiency: string
}

type SocialLinks = {
  github: string
  linkedin: string
  portfolio: string
}

type UserData = {
  firstName: string
  lastName: string
  fullName: string
  country: string
  city: string
  gender: string
  dateOfBirth: string
  user: string
  profilePicture: string
  profileSummary: string
  resume: string
  technicalSkills: TechnicalSkill[]
  otherSkills: string[]
  experience: Experience[]
  preference: Preference
  projects: Project[]
  education: Education[]
  certification: Certification[]
  languages: Language[]
  socialLinks: SocialLinks
}

interface ViewPublicProfileDialogProps {
  open: boolean
  onClose: (open: boolean) => void
  data: UserData
}

export default function ViewPublicProfileDialog({
  open,
  onClose,
  data,
}: ViewPublicProfileDialogProps) {
  const yearsOfExperience =
    data.experience.length > 0
      ? `${new Date().getFullYear() - new Date(data.experience[0].workSince).getFullYear()} Years`
      : 'Not Specified'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <DialogHeader>
          <DialogTitle>Public Profile</DialogTitle>
        </DialogHeader>
        <Card className="p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <Image
                src={data?.profilePicture}
                alt="Avatar Icon"
                width={160}
                height={160}
                className="rounded-full object-cover border border-gray-300 aspect-square overflow-hidden"
              />
            </div>
            <div className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-2">
                <div className="flex flex-col sm:flex-row items-center space-x-4">
                  <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-semibold">
                      {data?.firstName} {data?.lastName}
                    </h2>
                    <p className="text-gray-600">{`${data?.country} ${data?.city}`}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-12 gap-y-4 -mt-4">
                <div className="flex flex-col w-full gap-2 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Image src={AvailableToWorkIcon} alt="Available Icon" />
                    <span className="text-sm text-muted-foreground">Available To Work</span>
                  </div>
                  <span className="text-lg font-medium">{`${data?.preference?.availableHours?.from || 'Not specified'} - ${data?.preference?.availableHours?.to || 'Not specified'}`}</span>
                </div>
                <div className="flex flex-col w-full gap-2 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Image src={EmploymentPreferenceIcon} alt="Employment Icon" />
                    <span className="text-sm text-muted-foreground">Employment Preference</span>
                  </div>
                  <span className="text-lg font-medium">
                    {data?.preference?.employmentPreference}
                  </span>
                </div>
                <div className="flex flex-col w-full gap-2 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Image src={YearsOfExperienceIcon} alt="Experience Icon" />
                    <span className="text-sm text-muted-foreground">Years of Experience</span>
                  </div>
                  <span className="text-lg font-medium">{yearsOfExperience}</span>
                </div>
                <div className="flex flex-col w-full gap-2 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Image src={DesiredSalaryIcon} alt="Salary Icon" />
                    <span className="text-sm text-muted-foreground">Desired Salary / Hour</span>
                  </div>
<span className="text-lg font-medium">
  {data?.preference?.desiredSalary?.price
    ? `${data?.preference?.desiredSalary?.currency || ''} ${
        data.preference.desiredSalary.price
      }`
    : 'Not specified'}
</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <Card className="p-6 rounded-lg lg:col-span-1 h-auto min-h-[360px] relative overflow-auto">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold">Languages</h3>
              </div>
              <div className="mt-4">
                {dropdownValue.proficiency.map(proficiency => {
                  const filteredLanguages = data?.languages.filter(
                    lang => lang.proficiency === proficiency
                  )
                  return filteredLanguages.length > 0 ? (
                    <div key={proficiency} className="mb-5">
                      <h4 className="text-sm text-text-600 font-semibold">{proficiency}</h4>
                      <div className="space-y-1">
                        {filteredLanguages.map((lang, index) => (
                          <span key={index} className="block text-lg font-medium">
                            {lang.language}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 rounded-lg">
              <div className="border-b pb-2">
                <h3 className="text-xl font-semibold">Summary</h3>
              </div>
              <p className="pt-4 text-base text-text-600 break-words">{data?.profileSummary}</p>
            </Card>
            <Card className="p-6 rounded-lg">
              <div className="border-b pb-2">
                <h3 className="text-xl font-semibold">Skills</h3>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium pt-4">Technical Skills</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data?.technicalSkills.map(skill => {
                    const years = parseFloat(skill.experience)
                    const formattedExperience = years === 1 ? '1 year' : `${years} years`
                    return (
                      <span
                        key={skill.skill}
                        className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
                      >
                        {skill.skill} | {formattedExperience}
                      </span>
                    )
                  })}
                </div>
                <span className="text-base font-medium pt-4">Soft Skills</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data?.otherSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full flex items-center"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
            <Card className="p-6 rounded-lg">
              <div className="border-b pb-2">
                <h3 className="text-xl font-semibold">Work Experience</h3>
              </div>
              <div className="mt-4 space-y-4">
                {data?.experience.length === 0 ? (
                  <p className="text-gray-500">No work experiences available.</p>
                ) : (
                  data?.experience.map((exp, index) => (
                    <div key={index} className="flex justify-between items-start pb-4">
                      <div className="max-w-[95%]">
                        <h4 className="text-lg font-semibold">{exp.designation}</h4>
                        <p className="text-base text-[#252B37] font-medium">
                          {exp.companyName} | {exp.workSince} -{' '}
                          {exp.currentlyWorking ? 'Present' : exp.workTill}
                        </p>
                        <p className="text-base text-text-600 mt-2 break-words">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card className="p-6 rounded-lg">
              <div className="border-b pb-2">
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <div className="mt-4 space-y-4">
                {data?.education.length === 0 ? (
                  <p className="text-gray-500">No education details available.</p>
                ) : (
                  data?.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start pb-4">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {edu.degree} in {edu.specialization}
                        </h4>
                        <p className="text-base text-text-600 font-medium">
                          {edu.university} |{' '}
                          {new Date(edu.passingOutYear).toLocaleString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card className="p-6 rounded-lg">
              <div className="border-b pb-2">
                <h3 className="text-xl font-semibold">Projects</h3>
              </div>
              <div className="mt-4 space-y-4">
                {data?.projects.length === 0 ? (
                  <p className="text-gray-500">No projects available.</p>
                ) : (
                  data?.projects.map((proj, index) => (
                    <div key={index} className="flex justify-between items-start pb-4">
                      <div>
                        <p className="text-base text-text-600 font-medium">{proj.year}</p>
                        <h4 className="text-lg font-semibold">{proj.projectTitle}</h4>
                        <p className="text-base text-text-600 mt-2 mb-2 break-all">
                          {proj.projectDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {proj?.technicalSkillUsed?.map(skill => (
                            <span
                              key={skill}
                              className="px-4 py-1 text-sm font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {proj?.projectLink && (
                          <p className="text-sm mt-4 text-blue-500 flex flex-row gap-2">
                            <Image src={LinkIcon} alt="Link Icon" />
                            <a href={proj.projectLink} target="_blank" rel="noopener noreferrer">
                              Project Link
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card className="p-6 rounded-lg">
              <div className="border-b pb-2">
                <h3 className="text-xl font-semibold">Certifications</h3>
              </div>
              <div className="mt-4 space-y-4">
                {data?.certification.length === 0 ? (
                  <p className="text-gray-500">No certifications available.</p>
                ) : (
                  data?.certification.map((cert, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div key={index} className="pb-4">
                        <h4 className="text-lg font-semibold">{cert.title}</h4>
                        <p className="text-base text-text-600 font-medium">
                          {cert.issuedBy} |{' '}
                          {new Date(cert.issuedDate).toLocaleString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        {cert?.website && (
                          <p className="text-sm mt-2 text-blue-500 flex flex-row gap-2">
                            <Image src={LinkIcon} alt="Link Icon" />
                            <a href={cert.website} target="_blank" rel="noopener noreferrer">
                              Certification Website Link
                            </a>
                          </p>
                        )}
                        {cert.uploadCertificate &&
                          (typeof cert.uploadCertificate === 'string' ? (
                            <Button
                              className="text-sm text-primary bg-tab-bg px-3 py-1 mt-4 border border-[#CEC0F6] rounded-full hover:bg-tab-bg"
                              onClick={() => {
                                const fileUrl = cert.uploadCertificate as string
                                const fileName = fileUrl.split('/').pop() || 'certificate.pdf'

                                fetch(fileUrl)
                                  .then(response => response.blob())
                                  .then(blob => {
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = fileName
                                    document.body.appendChild(a)
                                    a.click()
                                    document.body.removeChild(a)
                                    URL.revokeObjectURL(url)
                                  })
                                  .catch(error => console.error('Download failed:', error))
                              }}
                            >
                              Download
                            </Button>
                          ) : (
                            Array.isArray(cert.uploadCertificate) &&
                            cert.uploadCertificate.length > 0 &&
                            cert.uploadCertificate.map((file, index) => (
                              <Button
                                key={index}
                                className="text-sm text-primary bg-tab-bg px-3 py-1 mt-4 border border-[#CEC0F6] rounded-full hover:bg-tab-bg"
                                onClick={() => {
                                  const url = URL.createObjectURL(file)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = file.name || `certificate-${index + 1}.pdf`
                                  document.body.appendChild(a)
                                  a.click()
                                  document.body.removeChild(a)
                                  URL.revokeObjectURL(url)
                                }}
                              >
                                Download
                              </Button>
                            ))
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
