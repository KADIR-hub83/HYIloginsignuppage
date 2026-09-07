'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { verificationApi } from '@/lib/services/verification'
import { VerificationStatus } from '@/lib/services/verification'
import {
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  RefreshCcw,
} from 'lucide-react'

const verificationStatus = {
  aadhar: {
    status: 'in_progress',
    submittedAt: '2024-03-20T10:30:00Z',
    number: 'XXXX XXXX 1234',
    estimatedCompletion: '2024-03-21T10:30:00Z',
    lastUpdated: '2024-03-20T15:45:00Z',
    notes: 'Verification in progress. Document under review.',
  },
  pan: {
    status: 'verified',
    submittedAt: '2024-03-19T14:20:00Z',
    number: 'ABCDE1234F',
    verifiedAt: '2024-03-19T14:25:00Z',
    lastUpdated: '2024-03-19T14:25:00Z',
    notes: 'PAN card successfully verified.',
  },
  international: {
    status: 'rejected',
    submittedAt: '2024-03-18T09:15:00Z',
    documentType: 'Passport',
    number: 'A1234567',
    lastUpdated: '2024-03-19T11:30:00Z',
    rejectionReason: 'Document image unclear. Please resubmit with better quality.',
  },
}

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

export default function VerificationStatusPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStatuses, setVerificationStatuses] = useState<any>(null)

  const fetchVerificationStatuses = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would store and retrieve verification IDs
      const mockVerificationIds = ['aadhar-123', 'pan-456', 'intl-789']
      const statuses = await Promise.all(
        mockVerificationIds.map(id => verificationApi.getVerificationStatus(id))
      )

      const statusData = statuses.reduce((acc: Record<string, VerificationStatus>, curr) => {
        if (curr.success && curr.data) {
          const { documentType } = curr.data.status
          acc[documentType] = curr.data.status
        }
        return acc
      }, {})

      setVerificationStatuses(statusData)
    } catch (error) {
      console.error('Failed to fetch verification statuses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVerificationStatuses()
  }, [])

  const handleRefresh = () => {
    fetchVerificationStatuses()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Verification Status</h2>
          <p className="text-muted-foreground mt-2">
            Track the status of your submitted verification documents
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCcw className="w-4 h-4" />
          {isLoading ? 'Refreshing...' : 'Refresh Status'}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Overall Status Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Verification Progress</h3>
              <p className="text-sm text-muted-foreground">2 of 3 documents verified</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">66%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '66%' }} />
            </div>
          </div>
        </Card>

        {/* Aadhar Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Aadhar Card Verification</h3>
            <div
              className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(verificationStatus.aadhar.status)}`}
            >
              {verificationStatus.aadhar.status === 'in_progress'
                ? 'In Progress'
                : verificationStatus.aadhar.status === 'verified'
                  ? 'Verified'
                  : 'Rejected'}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Document Number</p>
                <p className="font-medium">{verificationStatus.aadhar.number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p className="font-medium">
                  {new Date(verificationStatus.aadhar.submittedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              {getStatusIcon(verificationStatus.aadhar.status)({ className: 'w-4 h-4 mt-0.5' })}
              <span className="text-muted-foreground">{verificationStatus.aadhar.notes}</span>
            </div>
            {verificationStatus.aadhar.status === 'in_progress' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-yellow-700">
                  <Clock className="w-4 h-4" />
                  <span>
                    Estimated completion by{' '}
                    {new Date(verificationStatus.aadhar.estimatedCompletion).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* PAN Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">PAN Card Verification</h3>
            <div
              className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(verificationStatus.pan.status)}`}
            >
              {verificationStatus.pan.status === 'in_progress'
                ? 'In Progress'
                : verificationStatus.pan.status === 'verified'
                  ? 'Verified'
                  : 'Rejected'}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Document Number</p>
                <p className="font-medium">{verificationStatus.pan.number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified On</p>
                <p className="font-medium">
                  {new Date(verificationStatus.pan.verifiedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              {getStatusIcon(verificationStatus.pan.status)({ className: 'w-4 h-4 mt-0.5' })}
              <span className="text-muted-foreground">{verificationStatus.pan.notes}</span>
            </div>
            {verificationStatus.pan.status === 'verified' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Document successfully verified</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* International ID Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">International ID Verification</h3>
            <div
              className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(verificationStatus.international.status)}`}
            >
              {verificationStatus.international.status === 'in_progress'
                ? 'In Progress'
                : verificationStatus.international.status === 'verified'
                  ? 'Verified'
                  : 'Rejected'}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Document Type</p>
                <p className="font-medium">{verificationStatus.international.documentType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Document Number</p>
                <p className="font-medium">{verificationStatus.international.number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p className="font-medium">
                  {new Date(verificationStatus.international.submittedAt).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>
            {verificationStatus.international.status === 'rejected' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-4">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <XCircle className="w-4 h-4 mt-0.5" />
                  <span>{verificationStatus.international.rejectionReason}</span>
                </div>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Resubmit Document
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button className="gap-2">
            Return to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
