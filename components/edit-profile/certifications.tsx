'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Pencil, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import FileUploader from '@/components/shared/fileUpload'
import LinkIcon from '@/components/assets/edit-profile/link.svg'
import { editProfileApi } from '@/lib/services/editProfileApi'
import { z } from 'zod'
import { certificationSchema } from '@/lib/validations/editProfile'

type Certification = {
  title: string
  issuedBy: string
  issuedDate: string
  uploadCertificate: File[] | string
  website: string
}

type CertificationPayload = {
  title: string
  issuedBy: string
  issuedDate: string
  uploadCertificate: string | null
  website: string
}

interface Errors {
  [key: number]: { [field: string]: string }
}

export default function CertificationsSection({
  certifications: initialCertifications,
}: {
  certifications: Certification[]
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications || [])
  const [tempCertifications, setTempCertifications] = useState<Certification[]>(
    initialCertifications || []
  )
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>({})
  const [loading, setLoading] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (initialCertifications && initialCertifications.length > 0) {
      setCertifications(initialCertifications)
      setTempCertifications(initialCertifications)
      const initialUploadedFiles: { [key: number]: File[] } = {}
      initialCertifications.forEach((cert, index) => {
        if (typeof cert.uploadCertificate === 'string' && cert.uploadCertificate) {
          initialUploadedFiles[index] = [new File([], cert.uploadCertificate)]
        }
      })
      setUploadedFiles(initialUploadedFiles)
    }
  }, [initialCertifications])

  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault()
    if (editingIndex === null || !tempCertifications) return
    setLoading(true)
    try {
      const certificationArraySchema = z.array(certificationSchema)
      certificationArraySchema.parse(tempCertifications)
      const updatedCertifications = [...certifications]
      updatedCertifications[editingIndex] =
        tempCertifications[editingIndex] || updatedCertifications[editingIndex]
      setCertifications(updatedCertifications)
      setErrors({})
      const formData = new FormData()
      formData.append('data', JSON.stringify({ certification: updatedCertifications }))
      Object.values(uploadedFiles).forEach(files => {
        files.forEach(file => {
          formData.append('uploadCertificate', file)
        })
      })
      await editProfileApi.updateTalent(formData)
      setEditingIndex(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          const [index, field] = err.path
          if (typeof index === 'number' && typeof field === 'string') {
            acc[index] = { ...acc[index], [field]: err.message }
          }
          return acc
        }, {} as Errors)
        setErrors(newErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setErrors({})
  }

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    setTempCertifications(prevCertifications => {
      const updated = [...prevCertifications]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })

    if (field in certificationSchema.shape) {
      try {
        const fieldSchema =
          certificationSchema.shape[field as keyof typeof certificationSchema.shape]
        fieldSchema.parse(value)
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors }
          delete newErrors[index]?.[field]
          if (Object.keys(newErrors[index] || {}).length === 0) delete newErrors[index]
          return newErrors
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [index]: {
              ...prevErrors[index],
              [field]: (error as z.ZodError).errors[0].message,
            },
          }))
        }
      }
    }
  }

  const handleFileUpload = (index: number, files: File[]) => {
    let hasError = false

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [index]: { ...prevErrors[index], uploadCertificate: 'File size must be less than 5MB' },
        }))
        hasError = true
        return false
      }
      return true
    })

    if (!hasError) {
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors }
        if (updatedErrors[index]) {
          delete updatedErrors[index].uploadCertificate
        }
        return updatedErrors
      })
    }

    setUploadedFiles(prevFiles => ({ ...prevFiles, [index]: validFiles }))
  }

  const handleAddCertification = () => {
    if (editingIndex !== null) return
    const newCertification: Certification = {
      title: '',
      issuedBy: '',
      issuedDate: '',
      uploadCertificate: '',
      website: '',
    }
    setCertifications([...certifications, newCertification])
    setTempCertifications([...tempCertifications, newCertification])
    setEditingIndex(certifications.length)
  }

  const handleDeleteCertification = async (index: number) => {
    setLoading(true)
    try {
      const updatedCertifications = certifications.filter((_, i) => i !== index)
      const formattedCertifications: CertificationPayload[] = updatedCertifications.map(cert => ({
        ...cert,
        uploadCertificate:
          typeof cert.uploadCertificate === 'string' && cert.uploadCertificate
            ? cert.uploadCertificate
            : null,
      }))
      setCertifications(updatedCertifications)
      setTempCertifications(updatedCertifications)
      if (editingIndex === index) {
        setEditingIndex(null)
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1)
      }
      await editProfileApi.updateTalent({ certification: formattedCertifications })
    } catch (error) {
      console.error('Error deleting certification:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setTempCertifications([...certifications])
  }

  return (
    <Card className="p-6 rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold">Certifications</h3>
      </div>
      {editingIndex !== null ? (
        <form onSubmit={handleSave} className="pt-4 space-y-4">
          <div className="flex flex-col gap-4 pb-4 border-b bg-[#F5F5F5] rounded-md md:p-6">
            <div>
              <label className="text-sm text-text-700 font-medium">Title</label>
              <Input
                type="text"
                value={tempCertifications[editingIndex]?.title}
                onChange={e => handleCertificationChange(editingIndex, 'title', e.target.value)}
              />
              {errors[editingIndex]?.title && (
                <span className="text-xs text-destructive">{errors[editingIndex]?.title}</span>
              )}
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Issued by</label>
                <Input
                  type="text"
                  value={tempCertifications[editingIndex]?.issuedBy}
                  onChange={e =>
                    handleCertificationChange(editingIndex, 'issuedBy', e.target.value)
                  }
                />
                {errors[editingIndex]?.issuedBy && (
                  <span className="text-xs text-destructive">{errors[editingIndex]?.issuedBy}</span>
                )}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-text-700 font-medium">Issued Date</label>
                <Popover
                  open={openIndex === editingIndex}
                  onOpenChange={isOpen => setOpenIndex(isOpen ? editingIndex : null)}
                >
                  <PopoverTrigger asChild className="bg-white">
                    <Button
                      variant={'outline'}
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setOpenIndex(editingIndex)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempCertifications[editingIndex]?.issuedDate
                        ? format(tempCertifications[editingIndex]?.issuedDate, 'PPP')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        tempCertifications[editingIndex]?.issuedDate
                          ? new Date(tempCertifications[editingIndex]?.issuedDate)
                          : undefined
                      }
                      onSelect={date => {
                        handleCertificationChange(
                          editingIndex,
                          'issuedDate',
                          date ? format(date, 'yyyy-MM-dd') : ''
                        )
                        setOpenIndex(null)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors[editingIndex]?.issuedDate && (
                  <span className="text-xs text-destructive">
                    {errors[editingIndex]?.issuedDate}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-text-700 font-medium">Upload Certificate</label>
              <FileUploader
                index={editingIndex}
                onUpload={handleFileUpload}
                selectedFiles={uploadedFiles[editingIndex] || []}
              />
              {errors[editingIndex]?.uploadCertificate && (
                <span className="text-xs text-destructive">
                  {errors[editingIndex]?.uploadCertificate}
                </span>
              )}
            </div>
            <div>
              <label className="text-sm text-text-700 font-medium">Certification Link</label>
              <Input
                type="text"
                value={tempCertifications[editingIndex]?.website}
                onChange={e => handleCertificationChange(editingIndex, 'website', e.target.value)}
              />
              {errors[editingIndex]?.website && (
                <span className="text-xs text-destructive">{errors[editingIndex]?.website}</span>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-semibold text-primary hover:text-primary"
                  onClick={() => handleDeleteCertification(editingIndex!)}
                >
                  Delete
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-4">
          {certifications.length === 0 ? (
            <p className="text-gray-500">No certifications available.</p>
          ) : (
            certifications.map((cert, index) => (
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
                          const fileUrl = cert.uploadCertificate as string // Explicitly cast as string
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
                <div className="flex gap-2">
                  <Pencil
                    size={20}
                    className="cursor-pointer text-gray-500"
                    onClick={() => handleEdit(index)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        className="font-semibold text-primary hover:text-primary pl-0"
        onClick={handleAddCertification}
      >
        + Add Certification
      </Button>
    </Card>
  )
}
