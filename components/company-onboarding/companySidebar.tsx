// shadcn Imports
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useApp } from '@/context/appContext'

// Context Import

// lucide-react Imports
import { CircleCheck, User2, Briefcase, CircleAlert, ArrowRight, Check } from 'lucide-react'

// Steps data
const onboardingSteps = [
  {
    id: 1,
    step: 'Company Information',
    icon: User2,
  },
  {
    id: 2,
    step: 'Verification',
    icon: Briefcase,
  },
]

// Tips data
const onboardingTips = [
  {
    id: 1,
    title: 'Professional Photo',
    info: 'Use a clear, professional headshot to make a great first impression',
  },
  {
    id: 2,
    title: 'Detailed Bio',
    info: 'Highlight your key achievements and what makes you unique',
  },
  {
    id: 3,
    title: 'Skills',
    info: 'List both technical and soft skills relevant to your field',
  },
  {
    id: 4,
    title: 'Work History ',
    info: 'Focus on measurable achievements and impact in previous roles',
  },
]

// Tips data
const onboardingNextSteps = [
  {
    id: 1,
    title: 'Verify your company',
  },
  {
    id: 2,
    title: 'Create New Project',
  },
  {
    id: 3,
    title: 'Add Team Members',
  },
]

export function CompanySidebar() {
  const { organizationFromActiveIndex } = useApp()
  const progressValue = organizationFromActiveIndex * 50
  return (
    <section className="flex flex-col gap-1">
      <Sidebar variant="floating" className="h-fit static">
        <SidebarContent>
          <SidebarGroup className="px-0 p-4">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-fit flex items-center gap-2">
                      <div className="w-fit h-fit text-brand-600 bg-brand-200 rounded-full p-1.5">
                        <CircleCheck strokeWidth={1.5} width={20} height={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-text-900">
                          Profile Completion
                        </span>
                        <span className="text-xs font-medium text-text-600">
                          Track your progress
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <div className="w-full flex justify-between">
                        <span className="text-xs font-normal text-text-600">Overall Progress</span>
                        <span className="text-xs font-normal text-text-800">{progressValue}%</span>
                      </div>
                      {/* <Progress value={progressValue} max={100} className=" h-1.5" /> */}
                    </div>
                    <div className="flex flex-col gap-4">
                      {onboardingSteps.map(step => {
                        return (
                          <div key={step.id} className="w-full flex justify-between">
                            <div className="flex items-center gap-2">
                              <step.icon
                                strokeWidth={1.5}
                                width={16}
                                height={16}
                                className="text-text-600"
                              />
                              <span className="text-md font-normal text-text-600">{step.step}</span>
                            </div>
                            <div
                              className={`${step.id <= organizationFromActiveIndex ? 'flex' : 'hidden'} text-green-500`}
                            >
                              <Check strokeWidth={1.5} width={20} height={20} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Sidebar variant="floating" className="h-fit static">
        <SidebarContent>
          <SidebarGroup className="px-0 p-4">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-fit flex items-center gap-2">
                      <div className="w-fit h-fit text-blue-600 bg-blue-200 rounded-full p-1.5">
                        <CircleAlert strokeWidth={1.5} width={20} height={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-text-900">
                          Tips for Success
                        </span>
                        <span className="text-xs font-medium text-text-600">
                          Make your profile stand out
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {onboardingTips.map(tip => {
                        return (
                          <div
                            key={tip.id}
                            className="flex flex-col rounded-lg bg-text-100 p-3 gap-2"
                          >
                            <p className="text-md font-semibold text-text-800">{tip.title}</p>
                            <p className="text-xs font-normal text-text-600">{tip.info}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Sidebar variant="floating" className="h-fit static">
        <SidebarContent>
          <SidebarGroup className="px-0 p-4">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-fit flex items-center gap-2">
                      <div className="w-fit h-fit text-green-600 bg-green-200 rounded-full p-1.5">
                        <ArrowRight strokeWidth={1.5} width={16} height={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-text-900">Next Steps</span>
                        <span className="text-xs font-medium text-text-600">
                          After completing your profile
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {onboardingNextSteps.map(step => {
                        return (
                          <div key={step.id} className="w-full flex items-center gap-2">
                            <div className="w-fit h-fit rounded-full bg-text-200 px-2 py-0.5">
                              <span className="text-md font-medium text-text-800">{step.id}</span>
                            </div>
                            <p className="text-xs font-semibold text-text-800">{step.title}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </section>
  )
}
