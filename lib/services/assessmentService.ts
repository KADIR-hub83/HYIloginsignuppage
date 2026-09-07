import { FileText, CheckCircle, LineChart, Clock } from 'lucide-react'
import { AssessmentData } from '@/lib/services/types/assessment'

const mockData: AssessmentData = {
  stats: [
    {
      title: 'Total Assessment',
      value: '12',
      icon: FileText,
      iconClass: 'text-purple-500 bg-purple-50',
    },
    {
      title: 'Assessment Passed',
      value: '8',
      icon: CheckCircle,
      iconClass: 'text-green-500 bg-green-50',
    },
    {
      title: 'Average Score',
      value: '85%',
      icon: LineChart,
      iconClass: 'text-orange-500 bg-orange-50',
    },
    {
      title: 'Time Spent',
      value: '24h',
      icon: Clock,
      iconClass: 'text-blue-500 bg-blue-50',
    },
  ],
  courses: [
    {
      id: '1',
      title: 'Frontend Development',
      description: 'Master modern web development with React, Next.js, and TypeScript',
      duration: '90 min',
      questions: 45,
      points: 100,
      level: 'Beginner',
      tags: ['React', 'Next.js', 'TypeScript', 'HTML', 'CSS'],
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      description:
        'Learn essential design principles and tools for creating exceptional user experiences',
      duration: '60 min',
      questions: 30,
      points: 75,
      level: 'Intermediate',
      tags: ['Figma', 'Design Systems', 'Wireframing', 'Prototyping'],
    },
    {
      id: '3',
      title: 'Full Stack Development',
      description: 'Build complete web applications from frontend to backend',
      duration: '120 min',
      questions: 60,
      points: 150,
      level: 'Advanced',
      tags: ['Node.js', 'React', 'PostgreSQL', 'API Design', 'DevOps'],
    },
    {
      id: '4',
      title: 'Cloud Architecture',
      description: 'Design and implement scalable cloud solutions',
      duration: '90 min',
      questions: 40,
      points: 100,
      level: 'Advanced',
      tags: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Microservices'],
    },
  ],
}

export async function getAssessmentData(): Promise<AssessmentData> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockData
}
