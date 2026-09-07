'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPlus, Trash2, Calendar, CreditCard, Star, Briefcase, X, Video } from 'lucide-react'
import CheckMarkIcon from '@/components/assets/company-dashboard/check-mark.svg'
import CandidateProfileIcon from '@/components/assets/company-dashboard/candidate-profile.svg'
import { companyDashboardApi } from '@/lib/services/companyDashboardApi'
import RejectConfirm from '@/components/company-dashboard/project-tabs/reject-confirm-dialog'
import ViewShortlistedCandidateProfile from '@/components/company-dashboard/project-tabs/view-candidate-profile-dialog'
interface Requirement {
  _id: string
  prDesignation: string
  prNumberOfCandidates: number
  prWorkExperience: string
  prWorkDuration: number
  prTechnicalSkills: string[]
  prDescription: string
  prCandidates: Candidate[]
  createdAt: string
  updatedAt: string
}

interface Candidate {
  candidateId: string
  fullName: string
  experience: Experience[]
  preference: Preference
  profilePicture: string
}

interface Experience {
  companyName: string
  workSince: string
  workTill: string
  designation: string
  currentlyWorking: boolean
  description: string
  totalYearsOfExperience: number
  _id: string
}

interface Preference {
  desiredSalary: {
    currency: string
    price: string
  }
  availableHours: {
    from: string
    to: string
  }
  employmentPreference: string
  hoursPerWeek: string
}
interface TeamTabProps {
  postRequirementList: Requirement[]
  setPostRequirementList: React.Dispatch<React.SetStateAction<Requirement[]>>
  setOpenPostRequirement: (open: boolean) => void
  setSelectedProject: (project: any | null) => void
  setSelectedRequirement: (requirement: Requirement) => void
  setOpenViewJobDescription: (open: boolean) => void
  projectId: string
}

const TeamTab: React.FC<TeamTabProps> = ({
  postRequirementList,
  setPostRequirementList,
  setOpenPostRequirement,
  setSelectedProject,
  setSelectedRequirement,
  setOpenViewJobDescription,
  projectId,
}) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [openViewProfileDialog, setOpenViewProfileDialog] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('')

  const handleDeletePostRequirement = async (postRequirementId: string) => {
    setIsDeleting(postRequirementId)
    try {
      await companyDashboardApi.deletePostRequirement({
        projectId,
        postRequirementId,
      })
      setPostRequirementList(prevList => prevList.filter(req => req._id !== postRequirementId))
    } catch (error) {
      console.error('Failed to delete post requirement:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleViewProfile = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setOpenViewProfileDialog(true)
  }

  return (
    <div>
      {postRequirementList.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6 mt-6">
            <div className="text-lg font-semibold text-text-800">Project Recruitment</div>
            <Button onClick={() => setOpenPostRequirement(true)}>+ Post Requirement</Button>
          </div>
          <div className="flex gap-8 flex-col">
            {postRequirementList?.map(requirement => (
              <Card
                key={requirement._id}
                className="border-text-200 bg-text-50 rounded-lg pt-5 pb-5 pr-6 pl-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-3">
                    <div className="text-text-800 text-xl font-semibold">
                      {requirement.prDesignation.charAt(0).toUpperCase() +
                        requirement.prDesignation.slice(1)}
                    </div>
                    <div className="text-md text-primary font-medium">
                      {requirement.prNumberOfCandidates} Candidates, {requirement.prWorkExperience}{' '}
                      Years Experience, {requirement.prWorkDuration} Days
                    </div>
                    <div className="text-xs text-text-600 font-medium">
                      Posted On -{' '}
                      <span className="text-text-800 font-semibold text-sm">
                        {new Date(requirement.createdAt)
                          .toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                          .replace(/(\d{1,2})/, match => {
                            const day = Number(match)
                            const suffixes = ['st', 'nd', 'rd']
                            const lastDigit = day % 10
                            const suffix =
                              day > 10 && day < 20 ? 'th' : suffixes[lastDigit - 1] || 'th'
                            return day + suffix
                          })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      className="text-sm font-semibold text-primary hover:text-primary border-[#CEC0F6]"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequirement(requirement)
                        setOpenViewJobDescription(true)
                      }}
                    >
                      View Job Description
                    </Button>
                    <Trash2
                      size={20}
                      color={isDeleting === requirement._id ? '#FF0000' : '#717680'}
                      className="cursor-pointer"
                      onClick={() => handleDeletePostRequirement(requirement._id)}
                    />
                  </div>
                </div>
                {requirement?.prCandidates.length === 0 ? (
                  ''
                ) : (
                  <div className="w-full mt-4">
                    <Tabs defaultValue="candidates" className="w-full">
                      <TabsList className="grid w-[40%] grid-cols-2">
                        <TabsTrigger
                          value="candidates"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-300 rounded-md px-4 py-2"
                        >
                          Candidates List
                        </TabsTrigger>
                        <TabsTrigger
                          value="rejected"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-300 rounded-md px-4 py-2"
                        >
                          Rejected
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="candidates">
                        <div className="flex flex-col gap-4 mt-4">
                          {' '}
                          {requirement.prCandidates.map(candidate => (
                            <Card
                              key={candidate.candidateId}
                              className="w-full border border-gray-200 rounded-lg p-6 flex items-center gap-6 shadow-sm"
                            >
                              {candidate?.profilePicture === 'N/A' ? (
                                <div className="flex-shrink-0">
                                  <Image
                                    src={CandidateProfileIcon}
                                    alt="Avatar"
                                    className="rounded-full object-cover border border-gray-300"
                                  />
                                </div>
                              ) : (
                                <div className="flex-shrink-0">
                                  <Image
                                    src={candidate.profilePicture}
                                    alt="Avatar"
                                    width={88}
                                    height={88}
                                    className="rounded-full object-cover border border-gray-300"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col flex-grow gap-3">
                                <div className="flex items-center gap-2">
                                  <p className="text-2xl font-semibold">{candidate.fullName}</p>
                                  <Image src={CheckMarkIcon} alt="Check Mark Icon" />
                                </div>
                                <div className="flex items-center font-semibold text-text-800 text-sm gap-4 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Briefcase size={16} color="#717680" />
                                    <span>{candidate.experience[0]?.designation}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar size={16} color="#717680" />
                                    <span>
                                      {candidate.experience[0]?.totalYearsOfExperience} yrs
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CreditCard size={16} color="#717680" />
                                    <span>{candidate.preference.desiredSalary.price} USD</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-500" />
                                    <span>3.2</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-4">
                                <div>
                                  {candidate.fullName === 'Karan Naidu' ? (
                                    <p className="text-green-600 text-sm font-semibold flex items-center gap-2">
                                      <Video size={20} />
                                      Scheduled
                                    </p>
                                  ) : (
                                    <Button className="flex items-center gap-2">
                                      <Video size={20} />
                                      Add to Interview
                                    </Button>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    className="flex items-center gap-2 text-sm text-text-700 hover:text-text-700 font-semibold"
                                    onClick={() => setOpenRejectDialog(true)}
                                  >
                                    <X size={16} />
                                    Reject
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="text-sm font-semibold text-primary hover:text-primary border-[#CEC0F6]"
                                    onClick={() => handleViewProfile(candidate.candidateId)}
                                  >
                                    View Profile
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="rejected">
                        <p className="text-sm text-text-600 mt-4 flex">
                          No Candidates are rejected yet
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-center mt-16">
          <div className="border border-[#E9EAEB] rounded-full w-16 h-16 flex items-center justify-center">
            <UserPlus className="opacity-75" size={30} />
          </div>
          <p className="font-semibold text-lg mt-4">Create a Team</p>
          <div className="mt-2">
            <p className="font-medium text-sm text-text-600">
              You haven’t shortlisted any candidates. Post your requirement to
            </p>
            <p className="font-medium text-sm text-text-600">your relationship manager.</p>
          </div>
          <Button className="mt-4" onClick={() => setOpenPostRequirement(true)}>
            + Post Requirement
          </Button>
        </div>
      )}
      <Button
        variant="ghost"
        className="mt-4 text-primary hover:text-primary"
        onClick={() => setSelectedProject(null)}
      >
        Back to Projects
      </Button>
      {openRejectDialog && (
        <RejectConfirm open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} />
      )}
      {openViewProfileDialog && selectedCandidateId && (
        <ViewShortlistedCandidateProfile
          open={openViewProfileDialog}
          onClose={() => setOpenViewProfileDialog(false)}
          selectedCandidateId={selectedCandidateId}
        />
      )}
    </div>
  )
}

export default TeamTab
