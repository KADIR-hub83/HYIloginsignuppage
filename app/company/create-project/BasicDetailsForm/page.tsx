'use client'
import Image from 'next/image'
import Link from 'next/link'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// svg imports
import BackIcon from '@/public/company/back-icon.svg'
import ArrowRightIcon from '@/public/company/arrow-right-icon.svg'

export default function BasicDetailsForm({ initialData, handlePrevStep, handleNextStep }: any) {
  return (
    <>
      <section className="flex justify-center w-full flex-col items-center px-4 sm:px-6 md:px-8">
        <form className="space-y-8 p-4 sm:p-6 w-full max-w-xl">
          <div className="w-full border rounded p-4 sm:p-6 mb-4 sm:mb-12">
            <div className="font-medium text-lg">Let's start with a strong title.</div>
            <div className="text-sm font-normal text-muted-foreground pb-4">
              This helps your job post stand out to the right candidates.
            </div>
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Project Name</Label>
              <Input
                className="h-12"
                type="text"
                name="name"
                placeholder="Write a title for your job post"
              />
            </div>
            <div>
              <Label className="text-base font-normal pb-6">Example titles</Label>
              <ul className="text-sm font-normal text-muted-foreground flex flex-col gap-2 pt-2">
                <li>• Build Responsive WordPress Site with Booking/Payment Features</li>
                <li>
                  • Graphic Designer Required for Designing Ad Creatives for Multiple Campaigns
                </li>
                <li>• Facebook Ad Specialist Needed for Product Launch</li>
              </ul>
            </div>
          </div>
          <div className="w-full border rounded mb-6 p-4 sm:p-6">
            <div className="font-medium text-lg">Describe what you need</div>
            <div className="text-sm font-normal text-muted-foreground pb-4">
              Describe hiring goals and candidate preferences.
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <Label className="text-sm font-normal">Discription</Label>
              <Textarea className="h-24" placeholder="Already have a description? Paste it here!" />
            </div>
          </div>
          <div className="max-w-4xl w-full flex justify-between">
            <Link href="/company/company-dashboard">
              <Button variant="ghost" onClick={handlePrevStep}>
                <Image src={BackIcon} alt="Back Icon" />
              </Button>
            </Link>
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
