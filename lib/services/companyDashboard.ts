// import { FolderClosed, CreditCard, HandCoins, UsersRound } from 'lucide-react'
// import { companyDashboardApi } from './companyDashboardApi'

// interface Stat {
//   title: string
//   value: string
//   icon: any
//   bgColor: string
//   iconColor: string
// }

// interface DashboardData {
//   stats: Stat[]
// }

// const mockData: DashboardData = {
//   stats: [
//     {
//       title: 'Ongoing Projects',
//       value: '0',
//       icon: FolderClosed,
//       bgColor: '#DCFAE6',
//       iconColor: '#079455',
//     },
//     {
//       title: 'Budget Allocation',
//       value: '$0',
//       icon: CreditCard,
//       bgColor: '#F1EDFD',
//       iconColor: '#7046E6',
//     },
//     {
//       title: 'Overall Spending',
//       value: '$0',
//       icon: HandCoins,
//       bgColor: '#D1E9FF',
//       iconColor: '#1570EF',
//     },
//     {
//       title: 'Total Candidates',
//       value: '0',
//       icon: UsersRound,
//       bgColor: '#F1EDFD',
//       iconColor: '#7046E6',
//     },
//   ],
// }

// export async function getCompanyDashboardData(): Promise<DashboardData> {
//   await new Promise(resolve => setTimeout(resolve, 1000))
//   try {
//     const response = await companyDashboardApi.companyDashboardStatus()
//     if (response) {
//       const { ongoingProject, budgetAllocation, overallSpending, totalCandidates } = response
//       return {
//         ...mockData,
//         stats: [
//           {
//             title: 'Ongoing Projects',
//             value: ongoingProject.toString(),
//             icon: FolderClosed,
//             bgColor: '#DCFAE6',
//             iconColor: '#079455',
//           },
//           {
//             title: 'Budget Allocation',
//             value: budgetAllocation,
//             icon: CreditCard,
//             bgColor: '#F1EDFD',
//             iconColor: '#7046E6',
//           },
//           {
//             title: 'Overall Spending',
//             value: overallSpending,
//             icon: HandCoins,
//             bgColor: '#D1E9FF',
//             iconColor: '#1570EF',
//           },
//           {
//             title: 'Total Candidates',
//             value: totalCandidates.toString(),
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
  CreditCard,
  HandCoins,
  UsersRound,
} from 'lucide-react'

import { companyDashboardApi } from './companyDashboardApi'

interface Stat {
  title: string
  value: string
  icon: any
  bgColor: string
  iconColor: string
}

interface DashboardData {
  stats: Stat[]
}

const defaultDashboardData: DashboardData = {
  stats: [
    {
      title: 'Ongoing Projects',
      value: '0',
      icon: FolderClosed,
      bgColor: '#DCFAE6',
      iconColor: '#079455',
    },
    {
      title: 'Budget Allocation',
      value: '$0',
      icon: CreditCard,
      bgColor: '#F1EDFD',
      iconColor: '#7046E6',
    },
    {
      title: 'Overall Spending',
      value: '$0',
      icon: HandCoins,
      bgColor: '#D1E9FF',
      iconColor: '#1570EF',
    },
    {
      title: 'Total Candidates',
      value: '0',
      icon: UsersRound,
      bgColor: '#F1EDFD',
      iconColor: '#7046E6',
    },
  ],
}

const safeNumber = (
  value: unknown,
  fallback = 0,
) => {
  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : fallback
}

const safeMoney = (
  value: unknown,
) => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return '$0'
  }

  if (typeof value === 'number') {
    return `$${value}`
  }

  const stringValue = String(value).trim()

  if (!stringValue) {
    return '$0'
  }

  return stringValue.startsWith('$')
    ? stringValue
    : `$${stringValue}`
}

export async function getCompanyDashboardData(): Promise<DashboardData> {
  try {
    const response =
      await companyDashboardApi.companyDashboardStatus()

    /*
     * Support:
     *
     * 1. Direct response
     * {
     *   ongoingProject,
     *   budgetAllocation,
     *   overallSpending,
     *   totalCandidates
     * }
     *
     * 2. Nested response
     * {
     *   success: true,
     *   data: {
     *      stats: {...}
     *   }
     * }
     */

    const payload =
      response?.data?.stats ||
      response?.data ||
      response ||
      {}

    const ongoingProject =
      safeNumber(
        payload?.ongoingProject ??
          payload?.ongoingProjects ??
          payload?.totalProjects ??
          0,
      )

    const budgetAllocation =
      payload?.budgetAllocation ??
      0

    const overallSpending =
      payload?.overallSpending ??
      0

    const totalCandidates =
      safeNumber(
        payload?.totalCandidates ??
          0,
      )

    return {
      stats: [
        {
          title: 'Ongoing Projects',
          value:
            ongoingProject.toString(),
          icon: FolderClosed,
          bgColor: '#DCFAE6',
          iconColor: '#079455',
        },
        {
          title: 'Budget Allocation',
          value:
            safeMoney(
              budgetAllocation,
            ),
          icon: CreditCard,
          bgColor: '#F1EDFD',
          iconColor: '#7046E6',
        },
        {
          title: 'Overall Spending',
          value:
            safeMoney(
              overallSpending,
            ),
          icon: HandCoins,
          bgColor: '#D1E9FF',
          iconColor: '#1570EF',
        },
        {
          title: 'Total Candidates',
          value:
            totalCandidates.toString(),
          icon: UsersRound,
          bgColor: '#F1EDFD',
          iconColor: '#7046E6',
        },
      ],
    }
  } catch (error) {
    console.error(
      'Error fetching company dashboard data:',
      error,
    )

    /*
     * Dashboard should still render
     * instead of crashing.
     */
    return defaultDashboardData
  }
}