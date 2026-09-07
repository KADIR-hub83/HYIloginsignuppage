'use client'
import React, { useState } from 'react'
import {
  FileText,
  Users,
  Calendar,
  MoreVertical,
  VideoIcon,
  VideoOffIcon,
  TimerIcon,
  ChevronDown,
  User,
  Edit,
  CopyIcon, 
  CheckCircle,
  CheckIcon,
  Building,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Calendar,
  MoreVertical,
  Users,
  VideoIcon,
  VideoOffIcon,
  TimerIcon,
}

interface StatsProps {
  title: string
  value: string | number
  icon: string
  bgColor: string
}

const stats: StatsProps[] = [
  { title: 'Upcoming', value: 2, icon: 'VideoIcon', bgColor: 'bg-purple-100' },
  { title: 'Completed', value: 3, icon: 'VideoIcon', bgColor: 'bg-green-100' },
  { title: 'Cancelled', value: 5, icon: 'VideoOffIcon', bgColor: 'bg-red-100' },
  { title: 'Total Hours', value: 12, icon: 'TimerIcon', bgColor: 'bg-blue-100' },
]

interface InterviewProps {
  id: number
  title: string
  type: string
  platform: string
  link: string
  status: string
  company: string
  dateTime: string
  interviewer: string
  actions: string[]
  description: string
  feedback?: string // Optional feedback field
}

const interviewData: InterviewProps[] = [
  {
    id: 1,
    title: 'Senior Developer',
    type: 'Technical Interview',
    platform: 'Google Meet',
    link: 'https://meet.google.com/example1',
    status: 'Upcoming',
    company: 'Digital Solutions',
    dateTime: 'March 25 at 10:00 AM',
    interviewer: 'Sarah Wilson',
    actions: ['Join Meet', 'Website'],
    description:
      'We are seeking a Software Engineer to develop, test, and maintain high-quality software solutions. The ideal candidate has experience in JavaScript, TypeScript, and React, strong problem-solving skills, and a solid understanding of development best practices. Familiarity with cloud platforms, databases, and version control is a plus.',
    feedback: '', // No feedback since it's upcoming
  },
  {
    id: 2,
    title: 'Backend Engineer',
    type: 'HR Screening',
    platform: 'Zoom',
    link: 'https://zoom.us/example2',
    status: 'Completed',
    company: 'Tech Innovators',
    dateTime: 'March 10 at 2:00 PM',
    interviewer: 'Michael Johnson',
    actions: ['Website'],
    description:
      'Looking for a Backend Engineer with experience in Node.js, Express, and PostgreSQL. Knowledge of Docker and Kubernetes is a plus. Strong problem-solving skills and ability to work in a team are required.',
    feedback: 'The interview was smooth. Need to improve on database optimization questions.',
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    type: 'Final Interview',
    platform: 'Microsoft Teams',
    link: 'https://teams.microsoft.com/example3',
    status: 'Cancelled',
    company: 'NextGen Tech',
    dateTime: 'March 18 at 4:30 PM',
    interviewer: 'Emily Carter',
    actions: ['Website'],
    description:
      'Seeking a Full Stack Developer proficient in React, Node.js, and MongoDB. Experience with GraphQL and microservices is a plus. The candidate should have a strong understanding of design patterns and best coding practices.',
    feedback: '', // No feedback since it was cancelled
  },
  {
    id: 4,
    title: 'Data Scientist',
    type: 'Technical Interview',
    platform: 'Google Meet',
    link: 'https://meet.google.com/example4',
    status: 'Completed',
    company: 'AI Innovations',
    dateTime: 'March 15 at 3:00 PM',
    interviewer: 'John Doe',
    actions: ['Website'],
    description:
      'We are looking for a Data Scientist with experience in Python, TensorFlow, and machine learning algorithms. Strong analytical and problem-solving skills are required.',
    feedback: 'I was asked about deep learning architectures. Need to improve on that.',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    type: 'HR Screening',
    platform: 'Skype',
    link: 'https://skype.com/example5',
    status: 'Completed',
    company: 'Cloud Solutions',
    dateTime: 'March 12 at 11:00 AM',
    interviewer: 'Jane Smith',
    actions: ['Website'],
    description:
      'Hiring a DevOps Engineer with experience in AWS, CI/CD, Terraform, and Kubernetes. Strong knowledge of automation tools and scripting languages is required.',
    feedback: '', // No feedback yet
  },
]

const updateFeedback = async (interviewId: number, feedback: string) => {
  try {
    const response = await fetch(`/api/interviews/${interviewId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    })
    if (!response.ok) throw new Error('Failed to update feedback')
    return await response.json()
  } catch (error) {
    console.error('Error updating feedback:', error)
  }
}

const updateInterviewStatus = async (id: number): Promise<string> => {
  return new Promise(resolve => setTimeout(() => resolve('Completed'), 1000))
}

const InterviewCard: React.FC<{ interview: InterviewProps }> = ({ interview }) => {
  const [showMore, setShowMore] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState(interview.feedback || '')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(interview.status || '')

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      await updateFeedback(interview.id, feedback) // API Call
      setShowFeedback(false) // Hide textarea after submission
    }
  }

  const handleMarkAsCompleted = async () => {
    setLoading(true)
    const updatedStatus = await updateInterviewStatus(interview.id) // API call
    setStatus(updatedStatus)
    setLoading(false)
  }

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const textToCopy = `Interview: ${interview.title}
Date & Time: ${interview.dateTime}
Interviewer: ${interview.interviewer}
Company: ${interview.company}
Platform: ${interview.platform}
Link: ${interview.link}
Description : ${interview.description}
`

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <Card className="p-6 w-full">
      <div className="space-y-3">
        {/* Title & Actions */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold  text-gray-800">{interview.title}</h2>

          {/* Conditional Buttons */}
          <div className="flex gap-x-2">
            <Button className="flex items-center gap-x-2" variant="outline" onClick={handleCopy}>
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <CopyIcon className="w-5 h-5" />
              )}
              {copied ? 'Copied!' : 'Copy'}{' '}
            </Button>
            {interview.status === 'Upcoming' ? (
              <>
                <Button
                  className="flex items-center gap-x-2"
                  variant="outline"
                  onClick={handleMarkAsCompleted}
                  disabled={loading}
                >
                  {loading ? 'Marking...' : 'Mark as Completed'}
                </Button>
                <Button className="flex items-center gap-x-2" variant="default">
                  <VideoIcon className="w-5 h-5" />
                  <a href={interview.link} target="_blank" rel="noopener noreferrer">
                    Join Meet
                  </a>
                </Button>
              </>
            ) : interview.status === 'Completed' ? (
              <>
                {feedback ? (
                  <Button
                    className="flex items-center gap-x-2"
                    variant="outline"
                    onClick={() => {
                      setShowMore(true)
                      setShowFeedback(true)
                    }}
                  >
                    <Edit className="w-5 h-5" /> Edit Feedback
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-x-2"
                    variant="outline"
                    onClick={() => {
                      setShowMore(true)
                      setShowFeedback(true)
                    }}
                  >
                    <Edit className="w-5 h-5" /> Provide Feedback
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Company Name */}
        <p className="font-small text-gray-600 flex items-center gap-x-2 mt-0">
          <Building className="w-5 h-5 text-gray-500" />
          {interview.company}
        </p>

        {/* Interview Details */}
        <p className="text-gray-600 flex items-center gap-x-6">
          <span className="flex items-center gap-x-2">
            <FileText className="w-5 h-5 text-gray-500" /> {interview.dateTime}
          </span>
          <span className="flex items-center gap-x-2">
            <User className="w-5 h-5 text-gray-500" /> {interview.interviewer}
          </span>
          <span className="flex items-center gap-x-2">
            <VideoIcon className="w-5 h-5 text-gray-500" /> {interview.type}
          </span>
        </p>

        {/* Show More Button & Description */}
        {showMore && (
          <>
            <p className="font-semibold text-gray-800">Description</p>
            <p className="text-gray-700">{interview.description}</p>

            {/* Feedback Section */}
            {interview.status === 'Completed' && (
              <>
                {showFeedback ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Write your feedback..."
                    />
                    <div className="flex justify-end gap-x-2 mt-2">
                      <Button variant="outline" onClick={() => setShowFeedback(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleFeedbackSubmit}>Submit</Button>
                    </div>
                  </div>
                ) : feedback ? (
                  <>
                    <p className="font-semibold text-gray-800">Feedback</p>
                    <p className="text-gray-700">{feedback}</p>
                  </>
                ) : null}
              </>
            )}
          </>
        )}

        <Button
          variant="ghost"
          className="text-blue-600 text-sm mt-2"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'See Less' : 'See More'}
        </Button>
      </div>
    </Card>
  )
}

export default function Interviews() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filteredInterviews =
    selectedFilter === 'All'
      ? interviewData
      : interviewData.filter(interview => interview.status === selectedFilter)

  return (
    <div className="w-full min-h-screen bg-background">
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Interviews</h1>
            <p className="text-muted-foreground">Manage your interview schedule</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${stat.bgColor}`}
                  >
                    {iconMap[stat.icon] ? (
                      React.createElement(iconMap[stat.icon], {
                        className: 'w-6 h-6 text-primary',
                      })
                    ) : (
                      <div className="w-6 h-6 bg-gray-300" />
                    )}
                  </div>
                  <h3 className="font-medium">{stat.title}</h3>
                </div>
                <p className="text-3xl font-semibold">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Dropdown Filter */}
        <div className="flex justify-between items-center mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] flex justify-between items-center">
                {selectedFilter}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              {['All', 'Upcoming', 'Completed', 'Cancelled'].map(status => (
                <DropdownMenuItem
                  key={status}
                  className="cursor-pointer hover:bg-red-200"
                  onClick={() => setSelectedFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => {}}>+ Request Interview</Button>

        </div>

        {/* Interview Cards */}
        <div className="flex flex-col gap-4">
          {filteredInterviews.map(interview => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      </main>
    </div>
  )
}
