'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getCookie } from '@/lib/cookies'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { userApi } from '@/lib/services/api'
import BasicDetailsSection from '@/components/edit-profile/basic-details'
import SummarySection from '@/components/edit-profile/summary'
import SocialLinksSection from '@/components/edit-profile/social-links'
import LanguageSection from '@/components/edit-profile/languages'
import ResumeSection from '@/components/edit-profile/resume'
import TechnicalSkillsSection from '@/components/edit-profile/technical-skills'
import WorkExperienceSection from '@/components/edit-profile/work-experience'
import ProjectSection from '@/components/edit-profile/projects'
import EducationSection from '@/components/edit-profile/education'
import CertificationsSection from '@/components/edit-profile/certifications'
import ViewPublicProfileDialog from '@/components/edit-profile/publicProfileDialog'
import { useApp } from '@/context/appContext'

type PhoneNumber = {
  dialCode: string
  number: number
}

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
  uploadCertificate: File[]
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
  phoneNumber: PhoneNumber[]
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

const initialUserData: UserData = {
  firstName: '',
  lastName: '',
  fullName: '',
  country: '',
  city: '',
  gender: '',
  dateOfBirth: '',
  user: '',
  profilePicture: '',
  phoneNumber: [],
  profileSummary: '',
  resume: '',
  technicalSkills: [],
  otherSkills: [],
  experience: [],
  preference: {
    employmentPreference: '',
    hoursPerWeek: 0,
    desiredSalary: {
      currency: '',
      price: 0,
    },
    availableHours: {
      from: '',
      to: '',
    },
  },
  projects: [],
  education: [],
  certification: [],
  languages: [],
  socialLinks: {
    github: '',
    linkedin: '',
    portfolio: '',
  },
}

export default function EditProfile() {
  const [data, setData] = useState<UserData>(initialUserData)
  const [skills, setSkills] = useState<TechnicalSkill[]>([])
  const [open, setOpen] = useState(false)
  // const {talentFormData} = useApp()

useEffect(() => {
  const token = getCookie('token') || ''

  if (!token) return

  const fetchProfile = async () => {
    try {
      const response: any = await userApi.getTalentData(token)

      console.log('GET TALENT RESPONSE:', response)

      const profile =
        response?.userData?.userData ??
        response?.userData ??
        response

      console.log('ACTUAL TALENT PROFILE:', profile)

      const location =
        Array.isArray(profile?.location) &&
        profile.location.length > 0
          ? profile.location[0]
          : {}

      const socialLinks =
        Array.isArray(profile?.socialLinks)
          ? profile.socialLinks[0] || {}
          : profile?.socialLinks || {}

      const preference =
        Array.isArray(profile?.preference)
          ? profile.preference[0] || {}
          : profile?.preference || {}

      setData({
        ...initialUserData,

        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        fullName:
          profile?.fullName ||
          `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),

        user: profile?.user || '',

        profilePicture:
          profile?.profilePicture || '',

        resume:
          profile?.resume || '',

        profileSummary:
          profile?.profileSummary ||
          profile?.summary ||
          '',

        gender:
          profile?.gender || '',

        dateOfBirth:
          profile?.dateOfBirth || '',

        country:
          profile?.country ||
          location?.country ||
          '',

        city:
          profile?.city ||
          location?.city ||
          '',

        phoneNumber: Array.isArray(profile?.phoneNumber)
          ? profile.phoneNumber
          : profile?.phoneNumber
            ? [
                {
                  dialCode: '+91',
                  number: Number(profile.phoneNumber),
                },
              ]
            : [],

        technicalSkills:
          Array.isArray(profile?.technicalSkills)
            ? profile.technicalSkills
            : [],

        otherSkills:
          Array.isArray(profile?.otherSkills)
            ? profile.otherSkills
            : [],

        experience:
          Array.isArray(profile?.experience)
            ? profile.experience
            : [],

        projects:
          Array.isArray(profile?.projects)
            ? profile.projects
            : [],

        education:
          Array.isArray(profile?.education)
            ? profile.education
            : [],

        certification:
          Array.isArray(profile?.certification)
            ? profile.certification
            : [],

        languages:
          Array.isArray(profile?.languages)
            ? profile.languages
            : [],

        preference: {
          employmentPreference:
            preference?.employmentPreference || '',

          hoursPerWeek:
            Number(preference?.hoursPerWeek) || 0,

          desiredSalary: {
            currency:
              preference?.desiredSalary?.currency || '',

            price:
              Number(
                preference?.desiredSalary?.price
              ) || 0,
          },

          availableHours: {
            from:
              preference?.availableHours?.from || '',

            to:
              preference?.availableHours?.to || '',
          },
        },

        socialLinks: {
          github:
            socialLinks?.github || '',

          linkedin:
            socialLinks?.linkedin || '',

          portfolio:
            socialLinks?.portfolio || '',
        },
      })
    } catch (error) {
      console.error(
        'Error fetching actual talent profile:',
        error
      )
    }
  }

  fetchProfile()
}, [])

useEffect(() => {
  if (!Array.isArray(data?.technicalSkills)) {
    setSkills([])
    return
  }

  setSkills(
    data.technicalSkills.map(skill => {
      const experience =
        typeof skill.experience === 'string'
          ? skill.experience
          : '0.0'

      const [year, month] = experience
        .split('.')
        .map(num => parseInt(num, 10) || 0)

      return {
        skill: skill.skill || '',
        experience,
        experienceYear: year,
        experienceMonth: month,
      }
    }) as TechnicalSkill[]
  )
}, [data.technicalSkills])

  return (
    <div className="w-full mx-auto px-4 py-6 md:px-0 lg:py-8">
      <div className="w-9/12 max-w-[1216px] mx-auto space-y-6 bg-[#F5F5F5]">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Edit Your Profile</div>
          <Button
            className="text-sm font-semibold text-primary bg-tab-bg px-3 py-1 border border-[#CEC0F6] rounded-full hover:bg-tab-bg"
            onClick={() => setOpen(true)}
          >
            View Public Profile
          </Button>
        </div>
        <BasicDetailsSection data={data} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <ResumeSection resume={data?.resume} />
            <LanguageSection languages={data?.languages} />
            <SocialLinksSection
              socialLinks={data?.socialLinks || { linkedin: '', github: '', portfolio: '' }}
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <SummarySection profileSummary={data?.profileSummary || ''} />
            <TechnicalSkillsSection technicalSkills={skills} softSkills={data?.otherSkills} />
            <WorkExperienceSection experience={data?.experience || []} />
            <ProjectSection projects={data?.projects || []} />
            <EducationSection education={data?.education || []} />
            <CertificationsSection certifications={data?.certification || []} />
          </div>
        </div>
      </div>
      {open && <ViewPublicProfileDialog open={open} onClose={() => setOpen(false)} data={data} />}
    </div>
  )
}
