'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface RejectDialogProps {
  open: boolean
  onClose: () => void
}

export default function RejectConfirm({ open, onClose }: RejectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full text-center p-6">
        <DialogHeader>
          <DialogTitle>Reject Candidate</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-700 text-left">
            Are you sure you want to reject the candidate?
          </p>
          <RadioGroup defaultValue="yes" className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="reject-yes" />
              <Label htmlFor="reject-yes" className="text-sm">
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="reject-no" />
              <Label htmlFor="reject-no" className="text-sm">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
