'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { verificationApi, type VerificationRequest } from '@/lib/services/verification'
import {
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Info,
  Shield,
  RefreshCcw,
  Clock,
  XCircle,
  ArrowRight,
} from 'lucide-react'

interface VerificationState {
  status: 'pending' | 'in_progress' | 'verified' | 'rejected' | 'expired'
  documentNumber?: string
  lastUpdated?: string
  verifiedAt?: string
  estimatedCompletion?: string
  rejectionReason?: string
  notes?: string
}

interface VerificationStates {
  [key: string]: VerificationState | undefined
}

const aadharSchema = z.object({
  aadharNumber: z
    .string()
    .length(12, 'Aadhar number must be exactly 12 digits')
    .regex(/^\d+$/, 'Aadhar number must contain only digits'),
})

const panSchema = z.object({
  panNumber: z
    .string()
    .length(10, 'PAN number must be exactly 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN number format'),
})

const internationalSchema = z
  .object({
    country: z.string().min(2, 'Country name is required'),
    passportNumber: z.string().optional(),
    nationalId: z.string().optional(),
  })
  .refine(data => data.passportNumber || data.nationalId, {
    message: 'Either passport number or national ID is required',
    path: ['passportNumber'],
  })

type AadharFormData = z.infer<typeof aadharSchema>
type PanFormData = z.infer<typeof panSchema>
type InternationalFormData = z.infer<typeof internationalSchema>

function getStatusColor(status: string) {
  switch (status) {
    case 'verified':
      return 'text-green-500 bg-green-50 border-green-200'
    case 'in_progress':
      return 'text-yellow-500 bg-yellow-50 border-yellow-200'
    case 'rejected':
      return 'text-red-500 bg-red-50 border-red-200'
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'verified':
      return CheckCircle2
    case 'in_progress':
      return Clock
    case 'rejected':
      return XCircle
    default:
      return AlertCircle
  }
}

export default function VerificationPage() {
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [verificationStates, setVerificationStates] = useState<VerificationStates>({})
  const [isLoading, setIsLoading] = useState(true)

  const aadharForm = useForm<AadharFormData>({
    resolver: zodResolver(aadharSchema),
    defaultValues: {
      aadharNumber: '',
    },
  })

  const panForm = useForm<PanFormData>({
    resolver: zodResolver(panSchema),
    defaultValues: {
      panNumber: '',
    },
  })

  const internationalForm = useForm<InternationalFormData>({
    resolver: zodResolver(internationalSchema),
    defaultValues: {
      country: '',
      passportNumber: '',
      nationalId: '',
    },
  })

  useEffect(() => {
    fetchVerificationStatuses()
  }, [])

  const fetchVerificationStatuses = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would store and retrieve verification IDs
      const mockVerificationIds = ['aadhar-123', 'pan-456', 'intl-789']
      const statuses = await Promise.all(
        mockVerificationIds.map(id => verificationApi.getVerificationStatus(id))
      )

      const states = statuses.reduce((acc, curr) => {
        if (curr.success && curr.data) {
          const { documentType, status, documentNumber, lastUpdated, verifiedAt } = curr.data.status
          acc[documentType] = { status, documentNumber, lastUpdated, verifiedAt }
        }
        return acc
      }, {} as VerificationStates)

      setVerificationStates(states)
    } catch (error) {
      console.error('Failed to fetch verification statuses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAadharVerification = async (data: AadharFormData) => {
    try {
      const isResubmission = verificationStates.aadhar?.status === 'verified'
      const verificationData: VerificationRequest = {
        documentType: 'aadhar',
        documentNumber: data.aadharNumber,
        resubmission: isResubmission,
        previousVerificationId: isResubmission ? 'aadhar-123' : undefined,
      }

      const response = await verificationApi.submitVerification(verificationData)

      if (response.success) {
        toast.success(response.message)
        await fetchVerificationStatuses()
      } else {
        toast.error(response.error || 'Verification failed')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    }
  }

  const handlePanVerification = async (data: PanFormData) => {
    try {
      const isResubmission = verificationStates.pan?.status === 'verified'
      const verificationData: VerificationRequest = {
        documentType: 'pan',
        documentNumber: data.panNumber,
        resubmission: isResubmission,
        previousVerificationId: isResubmission ? 'pan-456' : undefined,
      }

      const response = await verificationApi.submitVerification(verificationData)

      if (response.success) {
        toast.success(response.message)
        await fetchVerificationStatuses()
      } else {
        toast.error(response.error || 'Verification failed')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    }
  }

  const handleInternationalVerification = async (data: InternationalFormData) => {
    const isResubmission = verificationStates.international?.status === 'verified'

    if (!documentFile && !isResubmission) {
      toast.error('Please upload a document')
      return
    }

    if (documentFile && documentFile?.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      const verificationData: VerificationRequest = {
        documentType: 'international',
        documentNumber: data.passportNumber || data.nationalId || '',
        documentFile: documentFile || undefined,
        country: data.country,
        documentCategory: data.passportNumber ? 'passport' : 'nationalId',
        resubmission: isResubmission,
        previousVerificationId: isResubmission ? 'intl-789' : undefined,
      }

      const response = await verificationApi.submitVerification(verificationData)

      if (response.success) {
        toast.success(response.message)
        await fetchVerificationStatuses()
        setDocumentFile(null)
      } else {
        toast.error(response.error || 'Verification failed')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    }
  }

  return (
    <div className="w-full flex container mx-auto p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold lg:text-2xl">Identity Verification</h2>
            <p className="text-muted-foreground mt-2">
              Verify your identity to access all platform features
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Your data is encrypted and secure</span>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={fetchVerificationStatuses}
              disabled={isLoading}
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status Card */}
        <Card className="p-6 bg-blue-50/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Info className="w-5 h-5" />
              <h2 className="font-semibold">Verification Tips</h2>
            </div>
            <div className="grid gap-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">1</span>
                </div>
                <p>
                  Keep your identification documents handy before starting the verification process
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">2</span>
                </div>
                <p>
                  Ensure all document numbers are entered exactly as they appear, including any
                  special characters
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">3</span>
                </div>
                <p>
                  For Indian citizens, both Aadhar and PAN verification are required. International
                  users need only their passport details
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium">4</span>
                </div>
                <p>
                  Verification typically takes 24 hours for Indian documents and up to 48 hours for
                  international documents
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="aadhar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aadhar">Aadhar Card</TabsTrigger>
            <TabsTrigger value="pan">PAN Card</TabsTrigger>
            <TabsTrigger value="international">International ID</TabsTrigger>
          </TabsList>

          <TabsContent value="aadhar">
            <Card className="p-6">
              {verificationStates.aadhar?.status === 'verified' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Aadhar Card Verified</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified on{' '}
                        {new Date(verificationStates.aadhar.verifiedAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Document Number</p>
                        <p className="font-medium">{verificationStates.aadhar.documentNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified on{' '}
                          {new Date(verificationStates.aadhar.verifiedAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          setVerificationStates(prev => ({
                            ...prev,
                            aadhar: undefined,
                          }))
                          aadharForm.reset()
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Re-verify
                      </Button>
                    </div>
                  </div>
                </div>
              ) : verificationStates.aadhar?.status === 'in_progress' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verification in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Please check back later for updates
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={aadharForm.handleSubmit(handleAadharVerification)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number</Label>
                    <Input
                      id="aadhar"
                      placeholder="Enter 12-digit Aadhar number"
                      {...aadharForm.register('aadharNumber', {
                        onChange: e => {
                          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12)
                        },
                      })}
                      maxLength={12}
                      className={aadharForm.formState.errors.aadharNumber ? 'border-red-500' : ''}
                    />
                    {aadharForm.formState.errors.aadharNumber && (
                      <p className="text-sm text-red-500">
                        {aadharForm.formState.errors.aadharNumber.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Enter your 12-digit Aadhar number without spaces
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span>
                        Make sure to enter the number exactly as it appears on your Aadhar card
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>Verification may take up to 24 hours to complete</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Verify Aadhar
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="pan">
            <Card className="p-6">
              {verificationStates.pan?.status === 'verified' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">PAN Card Verified</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified on{' '}
                        {new Date(verificationStates.pan.verifiedAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Document Number</p>
                        <p className="font-medium">{verificationStates.pan.documentNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified on{' '}
                          {new Date(verificationStates.pan.verifiedAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          setVerificationStates(prev => ({
                            ...prev,
                            pan: undefined,
                          }))
                          panForm.reset()
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Re-verify
                      </Button>
                    </div>
                  </div>
                </div>
              ) : verificationStates.pan?.status === 'in_progress' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verification in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Please check back later for updates
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={panForm.handleSubmit(handlePanVerification)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      placeholder="Enter 10-character PAN number"
                      {...panForm.register('panNumber', {
                        onChange: e => {
                          e.target.value = e.target.value.toUpperCase().slice(0, 10)
                        },
                      })}
                      maxLength={10}
                      className={panForm.formState.errors.panNumber ? 'border-red-500' : ''}
                    />
                    {panForm.formState.errors.panNumber && (
                      <p className="text-sm text-red-500">
                        {panForm.formState.errors.panNumber.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Enter your 10-character PAN number in ABCDE1234F format
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span>PAN number should match your income tax records</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Instant verification available</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Verify PAN
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="international">
            <Card className="p-6">
              {verificationStates.international?.status === 'verified' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">International ID Verified</h3>
                      <p className="text-sm text-muted-foreground">
                        Verified on{' '}
                        {new Date(
                          verificationStates.international.verifiedAt!
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Document Number</p>
                        <p className="font-medium">
                          {verificationStates.international.documentNumber}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified on{' '}
                          {new Date(
                            verificationStates.international.verifiedAt!
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          setVerificationStates(prev => ({
                            ...prev,
                            international: undefined,
                          }))
                          internationalForm.reset()
                          setDocumentFile(null)
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Re-verify
                      </Button>
                    </div>
                  </div>
                </div>
              ) : verificationStates.international?.status === 'in_progress' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verification in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Please check back later for updates
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={internationalForm.handleSubmit(handleInternationalVerification)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Enter your country"
                        {...internationalForm.register('country')}
                        className={
                          internationalForm.formState.errors.country ? 'border-red-500' : ''
                        }
                      />
                      {internationalForm.formState.errors.country && (
                        <p className="text-sm text-red-500">
                          {internationalForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport Number</Label>
                        <Input
                          id="passport"
                          placeholder="Enter passport number"
                          {...internationalForm.register('passportNumber')}
                          className={
                            internationalForm.formState.errors.passportNumber
                              ? 'border-red-500'
                              : ''
                          }
                        />
                        {internationalForm.formState.errors.passportNumber && (
                          <p className="text-sm text-red-500">
                            {internationalForm.formState.errors.passportNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nationalId">National ID</Label>
                        <Input
                          id="nationalId"
                          placeholder="Enter national ID number"
                          {...internationalForm.register('nationalId')}
                          className={
                            internationalForm.formState.errors.nationalId ? 'border-red-500' : ''
                          }
                        />
                        {internationalForm.formState.errors.nationalId && (
                          <p className="text-sm text-red-500">
                            {internationalForm.formState.errors.nationalId.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Document</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Input
                          type="file"
                          className="hidden"
                          id="document"
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file && file.size > 5 * 1024 * 1024) {
                              toast.error('File size must be less than 5MB')
                              e.target.value = ''
                              return
                            }
                            setDocumentFile(file || null)
                          }}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <Label htmlFor="document" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="font-medium">Click to upload document</span>
                            <span className="text-sm text-muted-foreground">
                              Supported formats: PDF, JPG, PNG (max 5MB)
                            </span>
                          </div>
                        </Label>
                        {documentFile && (
                          <div className="mt-4 text-sm text-muted-foreground">
                            Selected file: {documentFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span>Please provide either passport or national ID for verification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>International verification may take 2-3 business days</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Submit for Verification
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
