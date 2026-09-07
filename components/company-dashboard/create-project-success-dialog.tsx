'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SuccessAlertIcon from '@/public/company/success-alert.svg'
import { useApp } from '@/context/appContext'
import ErrorAlertIcon from '@/public/company/error-alert-icon.svg'

interface SuccessDialogProps {
  open: boolean
  onClose: () => void
  message: string
  isError: boolean
}

export default function SuccessDialog({ open, onClose, message, isError }: SuccessDialogProps) {
  const { setActiveLink, updateProjectsList } = useApp()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full text-center p-6">
        <div className="flex flex-col items-center">
          <Image
            src={isError ? ErrorAlertIcon : SuccessAlertIcon}
            alt={isError ? 'Error Icon' : 'Success Icon'}
            width={50}
            height={50}
          />
          <DialogHeader>
            <DialogTitle className={`text-lg font-semibold mt-4 ${isError ? 'text-red-600' : ''}`}>
              {isError ? 'Project Update Failed' : 'Successfully Updated Project'}
            </DialogTitle>
          </DialogHeader>
          <p className={`mt-2 ${isError ? 'text-red-500' : 'text-gray-500'}`}>{message}</p>
          <div className="mt-4 flex space-x-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {!isError && (
              <Button
                onClick={async () => {
                  await updateProjectsList()
                  setActiveLink(2)
                  onClose()
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
