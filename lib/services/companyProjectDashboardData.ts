// import { FolderClosed, UsersRound, FolderPlus, FolderCheck } from 'lucide-react'
// import { companyDashboardApi } from './companyDashboardApi'

// interface Project {
//   title: string
//   value: string
//   icon: any
//   bgColor: string
//   iconColor: string
// }

// interface DashboardData {
//   projects: Project[]
// }

// const mockData: DashboardData = {
//   projects: [
//     {
//       title: 'Upcoming Projects',
//       value: '0',
//       icon: FolderPlus,
//       bgColor: '#F5F5F5',
//       iconColor: '#535862',
//     },
//     {
//       title: 'Ongoing Projects',
//       value: '0',
//       icon: FolderClosed,
//       bgColor: '#FEF0C7',
//       iconColor: '#DC6803',
//     },
//     {
//       title: 'Completed Projects',
//       value: '0',
//       icon: FolderCheck,
//       bgColor: '#DCFAE6',
//       iconColor: '#079455',
//     },
//     {
//       title: 'Team Members',
//       value: '0',
//       icon: UsersRound,
//       bgColor: '#F1EDFD',
//       iconColor: '#7046E6',
//     },
//   ],
// }

// export async function getCompanyProjectDashboardData(companyId: string): Promise<DashboardData> {
//   await new Promise(resolve => setTimeout(resolve, 1000))

//   try {
//     const response = await companyDashboardApi.projectDashboardStatus({ companyId })

//     if (response?.success && response.data?.projectStatus) {
//       const { projectStatus } = response.data
//       return {
//         ...mockData,
//         projects: [
//           {
//             title: 'Upcoming Projects',
//             value: projectStatus.upcomingProject.toString(),
//             icon: FolderPlus,
//             bgColor: '#F5F5F5',
//             iconColor: '#535862',
//           },
//           {
//             title: 'Ongoing Projects',
//             value: projectStatus.onGoingProject.toString(),
//             icon: FolderClosed,
//             bgColor: '#FEF0C7',
//             iconColor: '#DC6803',
//           },
//           {
//             title: 'Completed Projects',
//             value: projectStatus.completeProject.toString(),
//             icon: FolderCheck,
//             bgColor: '#DCFAE6',
//             iconColor: '#079455',
//           },
//           {
//             title: 'Team Members',
//             value: projectStatus.totalTeamMembers.toString(),
//             icon: UsersRound,
//             bgColor: '#F1EDFD',
//             iconColor: '#7046E6',
//           },
//         ],
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching company dashboard data:', error)
//     throw new Error('Failed to fetch company dashboard data')
//   }

//   return mockData
// }




















































import {
  FolderClosed,
  UsersRound,
  FolderPlus,
  FolderCheck,
} from 'lucide-react'

import { companyDashboardApi } from './companyDashboardApi'

interface Project {
  title: string
  value: string
  icon: any
  bgColor: string
  iconColor: string
}

interface DashboardData {
  projects: Project[]
}

const defaultProjectDashboardData: DashboardData = {
  projects: [
    {
      title: 'Upcoming Projects',
      value: '0',
      icon: FolderPlus,
      bgColor: '#F5F5F5',
      iconColor: '#535862',
    },
    {
      title: 'Ongoing Projects',
      value: '0',
      icon: FolderClosed,
      bgColor: '#FEF0C7',
      iconColor: '#DC6803',
    },
    {
      title: 'Completed Projects',
      value: '0',
      icon: FolderCheck,
      bgColor: '#DCFAE6',
      iconColor: '#079455',
    },
    {
      title: 'Team Members',
      value: '0',
      icon: UsersRound,
      bgColor: '#F1EDFD',
      iconColor: '#7046E6',
    },
  ],
}

const safeNumber = (
  value: unknown,
) => {
  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : 0
}

export async function getCompanyProjectDashboardData(
  companyId: string,
): Promise<DashboardData> {
  if (!companyId) {
    return defaultProjectDashboardData
  }

  try {
    const response =
      await companyDashboardApi.projectDashboardStatus({
        companyId,
      })

    const projectStatus =
      response?.data?.projectStatus ||
      response?.projectStatus ||
      response?.data ||
      response

    if (!projectStatus) {
      return defaultProjectDashboardData
    }

    return {
      projects: [
        {
          title: 'Upcoming Projects',
          value:
            safeNumber(
              projectStatus?.upcomingProject,
            ).toString(),
          icon: FolderPlus,
          bgColor: '#F5F5F5',
          iconColor: '#535862',
        },
        {
          title: 'Ongoing Projects',
          value:
            safeNumber(
              projectStatus?.onGoingProject ??
                projectStatus?.ongoingProject,
            ).toString(),
          icon: FolderClosed,
          bgColor: '#FEF0C7',
          iconColor: '#DC6803',
        },
        {
          title: 'Completed Projects',
          value:
            safeNumber(
              projectStatus?.completeProject ??
                projectStatus?.completedProject,
            ).toString(),
          icon: FolderCheck,
          bgColor: '#DCFAE6',
          iconColor: '#079455',
        },
        {
          title: 'Team Members',
          value:
            safeNumber(
              projectStatus?.totalTeamMembers,
            ).toString(),
          icon: UsersRound,
          bgColor: '#F1EDFD',
          iconColor: '#7046E6',
        },
      ],
    }
  } catch (error) {
    console.error(
      'Error fetching project dashboard data:',
      error,
    )

    return defaultProjectDashboardData
  }
}