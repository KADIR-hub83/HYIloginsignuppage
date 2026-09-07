'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Download, CloudUpload, Trash2 } from 'lucide-react'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { z } from 'zod'
import { resumeSchema } from '@/lib/validations/editProfile'

interface ResumeSectionProps {
  resume: string
}

interface Errors {
  [key: string]: string
}

const getFileName = (url: string | null) => {
  if (!url) return 'No resume uploaded'
  const decodedUrl = decodeURIComponent(url.split('/').pop() || '')
  const parts = decodedUrl.split('_')
  if (parts.length < 2) return decodedUrl
  let filename = parts.slice(1).join('_')
  return filename.replace(/(\.docx|\.doc|\.pdf)(\.\w+)?$/, '$1')
}

export default function ResumeSection({ resume }: ResumeSectionProps) {
  const [localResume, setLocalResume] = useState<string | null>(resume)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    setLocalResume(resume)
  }, [resume])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const result = resumeSchema.safeParse({ resume: file })
    if (!result.success) {
      setErrors({ resume: result.error.errors[0].message })
      setSelectedFile(null)
      setSelectedFileName(null)
    } else {
      setErrors({})
      setSelectedFile(file)
      setSelectedFileName(file.name)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setErrors({})
    setUploading(true)
    try {
      const response = await editProfileApi.updateTalent({ resume: selectedFile })
      if (response?.data?.resumeUrl) {
        setLocalResume(response.data.resumeUrl)
        setSelectedFileName(null)
      }
    } catch (error) {
      console.error('Error updating resume:', error)
    } finally {
      setUploading(false)
      setOpenDialog(false)
      setSelectedFile(null)
    }
  }

  return (
    <Card className="p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Resume</h3>
      </div>
      {localResume ? (
        <div className="flex items-center justify-between rounded-lg pt-4">
          <div className="flex items-center gap-2 w-full">
            <p className="text-base font-semibold truncate max-w-[80%]">
              {selectedFileName || getFileName(localResume)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={async () => {
                try {
                  const response = await fetch(localResume)
                  const blob = await response.blob()
                  const blobUrl = window.URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = blobUrl
                  link.download = selectedFileName || getFileName(localResume)
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  window.URL.revokeObjectURL(blobUrl)
                } catch (error) {
                  console.error('Download failed:', error)
                }
              }}
            >
              <Download size={20} className="text-gray-500" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-2">No resume uploaded</p>
      )}
      <div className="w-full">
        <Button
          variant="outline"
          className="w-full mt-4 border border-[#CEC0F6] text-base font-semibold text-primary bg-tab-bg rounded-full hover:bg-tab-bg hover:text-primary transition-all disabled:opacity-50 flex justify-center"
          onClick={() => setOpenDialog(true)}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </div>
      <p className="text-gray-500 text-sm mt-2 text-center">.doc, .docx, pdf (max 5MB)</p>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <h3 className="text-lg font-semibold">Upload Resume</h3>
          </DialogHeader>
          <div
            className="border-2 border-primary rounded-lg p-4 flex flex-col items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload size={24} className="text-gray-500" />
            <div className="inline-flex space-x-1">
              <span className="text-sm font-semibold text-primary">Click to upload</span>
              <span className="text-sm font-medium text-gray-500">or drag and drop</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">.doc, .docx, pdf (max 5MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".doc,.docx,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          {selectedFile && (
            <div className="border border-gray-300 p-3 rounded-md flex justify-between items-center mt-4">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => setSelectedFile(null)}
              >
                <Trash2 size={20} color="#717680" />
              </Button>
            </div>
          )}
          {errors.resume && <span className="text-xs text-destructive">{errors.resume}</span>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false)
                setErrors({})
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
