'use client'
import Image from 'next/image'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// svg imports
import BackIcon from '@/public/company/back-icon.svg'
import ArrowRightIcon from '@/public/company/arrow-right-icon.svg'

export default function ScopeAndSkill({ initialData, handlePrevStep, handleNextStep }: any) {
  return (
    <>
      <section className="flex justify-center w-full flex-col items-center px-4 sm:px-6 md:px-8">
        <form className="space-y-8 p-4 sm:p-6 w-full max-w-xl">
          <div className="w-full border rounded p-4 sm:p-6 mb-4 sm:mb-12">
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Scope of Work</Label>
              <ToggleGroup type="single" className="flex justify-start">
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs border border-gray-300 rounded-md"
                  value="one-time"
                  aria-label="Toggle one-time"
                >
                  One-time project
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs border border-gray-300 rounded-md"
                  value="on-going"
                  aria-label="Toggle on-going"
                >
                  Ongoing collaboration
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div>
              <Label className="text-sm font-normal pb-6">Example</Label>
              <div className="text-sm text-muted-foreground pb-4">
                <span className="font-bold">One-time project: </span>
                <span>
                  App Dev, Website Redesign, Custom Software, Marketing Campaign, Graphic Design,
                  Product Launch.
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-bold">Ongoing collaboration: </span>
                <span>
                  Managed Services, Product Support, Marketing & Growth, Team Augmentation, Customer
                  Support, R&D.
                </span>
              </div>
            </div>
          </div>
          <div className="w-full border rounded mb-6 p-4 sm:p-6">
            <div className="font-medium text-lg">Skill Categories</div>
            <div className="flex flex-col gap-1.5 pt-4 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Technical Roles</Label>
              <ToggleGroup type="single" className="flex flex-wrap gap-2 justify-start">
                <ToggleGroupItem
                  value="developers"
                  aria-label="Toggle developers"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Developers (Frontend, Backend, Full Stack)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="devOps"
                  aria-label="Toggle DevOps"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  DevOps
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="lead"
                  aria-label="Toggle lead"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Team Lead
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="architect"
                  aria-label="Toggle architect"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Software Architect
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="qa"
                  aria-label="Toggle qa"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  QA Engineer
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Creative Roles</Label>
              <ToggleGroup type="single" className="flex flex-wrap gap-2 justify-start">
                <ToggleGroupItem
                  value="designer"
                  aria-label="Toggle designer"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Designers (UI/UX, Graphic, Web)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="copywriter"
                  aria-label="Toggle copywriter"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Copywriter
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="product"
                  aria-label="Toggle product-designer"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Product Designer
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Leadership Roles</Label>
              <ToggleGroup type="single" className="flex flex-wrap gap-2 justify-start">
                <ToggleGroupItem
                  value="founder"
                  aria-label="Toggle founder"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Co-Founder
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="mentor"
                  aria-label="Toggle mentor"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Mentor
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="cmo"
                  aria-label="Toggle cmo"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Chief Marketing Officer (CMO)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="coo"
                  aria-label="Toggle coo"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Chief Operating Officer (COO)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="proj-manager"
                  aria-label="Toggle proj-manager"
                  className="bg-card font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Project Manager
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="hr-director"
                  aria-label="Toggle hr-director"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  HR Director
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="hr-manager"
                  aria-label="Toggle hr-manager"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  HR Business Manager (HRBM)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="marketing"
                  aria-label="Toggle marketing"
                  className="bg-muted font-normal text-xs px-4 py-2 whitespace-nowrap border border-gray-300 rounded-md"
                >
                  Marketing Team
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          <div className="max-w-4xl w-full flex justify-between">
            <Button variant="ghost" onClick={handlePrevStep}>
              <Image src={BackIcon} alt="Back Icon" />
            </Button>
            <Button type="submit" onClick={handleNextStep} className="pr-12 pl-12">
              Continue
              <Image src={ArrowRightIcon} alt="Arrow Right Icon" />
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}
