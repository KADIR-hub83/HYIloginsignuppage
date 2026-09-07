'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface ViewJobDescriptionDialogProps {
  open: boolean
  onClose: (open: boolean) => void
  requirement: any
}

export default function ViewJobDescriptionDialog({
  open,
  onClose,
  requirement,
}: ViewJobDescriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <DialogHeader>
          <DialogTitle>View Job Description</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="w-full sm:w-1/4">
            <Label className="text-text-700">
              Designation
              <span className="text-500 text-primary pl-0.5">*</span>
            </Label>
            <div className="text-xl font-semibold mt-2">{requirement.prDesignation}</div>
          </div>
          <div className="w-full sm:w-1/4">
            <Label className="text-text-700">
              Work Experience
              <span className="text-500 text-primary pl-0.5">*</span>
            </Label>
            <div className="text-xl font-semibold mt-2">{requirement.prWorkExperience} Years</div>
          </div>
          <div className="w-full sm:w-1/4">
            <Label className="text-text-700">
              Number of Candidates
              <span className="text-500 text-primary pl-0.5">*</span>
            </Label>
            <div className="text-xl font-semibold mt-2">{requirement.prNumberOfCandidates}</div>
          </div>
          <div className="w-full sm:w-1/4">
            <Label className="text-text-700">
              Work Duration
              <span className="text-500 text-primary pl-0.5">*</span>
            </Label>
            <div className="text-xl font-semibold mt-2">{requirement.prWorkDuration} Days</div>
          </div>
        </div>
        <div className="w-full">
          <Label className="text-text-700">
            Technical Skills
            <span className="text-500 text-primary pl-0.5">*</span>
          </Label>
          <div className='flex gap-4 mt-2'>
            {requirement.prTechnicalSkills.map((skill: string) => (
              <span key={skill} className="px-4 py-1 text-base font-medium text-primary border border-[#CEC0F6] bg-tab-bg rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full">
          <Label className="text-text-700">
            Description
            <span className="text-500 text-primary pl-0.5">*</span>
          </Label>
          <div className="text-md font-medium mt-2 text-text-900">{requirement.prDescription}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
