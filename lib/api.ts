import { FileText, Users, CreditCard, Clock } from 'lucide-react'

interface Stat {
  title: string
  value: string
  icon: any
}

interface Project {
  id: string
  name: string
  description: string
  progress: number
  date: string
  status: string
  teamSize: number
  teamMembers: {
    id: string
    avatar: string
    name: string
  }[]
}

interface DashboardData {
  stats: Stat[]
  projects: Project[]
}

const mockData: DashboardData = {
  stats: [
    { title: 'Projects', value: '8', icon: FileText },
    { title: 'Interviews', value: '5', icon: Users },
    { title: 'Tasks', value: '34', icon: FileText },
    { title: 'Earning', value: '$4.2k', icon: CreditCard },
    { title: 'Hours Spent', value: '186', icon: Clock },
  ],
  projects: [
    {
      id: '1',
      name: 'TechFlow',
      description: 'Enterprise workflow automation platform with AI-powered process optimization.',
      progress: 85,
      date: 'February 2025',
      status: 'Ongoing',
      teamSize: 6,
      teamMembers: [
        {
          id: '1',
          name: 'Alex Smith',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '2',
          name: 'Emma Wilson',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '3',
          name: 'Michael Chen',
          avatar:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '4',
          name: 'Sarah Johnson',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '5',
          name: 'David Park',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '6',
          name: 'Lisa Zhang',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
    },
    {
      id: '2',
      name: 'CloudScale',
      description:
        'Cloud infrastructure management and optimization platform for enterprise deployments.',
      progress: 45,
      date: 'March 2025',
      status: 'In Progress',
      teamSize: 5,
      teamMembers: [
        {
          id: '7',
          name: 'James Wilson',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '8',
          name: 'Nina Patel',
          avatar:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '9',
          name: 'Tom Harris',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '10',
          name: 'Anna Kim',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '11',
          name: 'Mark Lee',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
    },
    {
      id: '3',
      name: 'DataSense',
      description:
        'Advanced analytics platform with real-time data processing and ML-powered insights.',
      progress: 30,
      date: 'April 2025',
      status: 'Planning',
      teamSize: 4,
      teamMembers: [
        {
          id: '12',
          name: 'Rachel Green',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '13',
          name: 'Chris Evans',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '14',
          name: 'Maya Patel',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          id: '15',
          name: 'Daniel Kim',
          avatar:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
    },
  ],
}

export async function getDashboardData(): Promise<DashboardData> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockData
}
