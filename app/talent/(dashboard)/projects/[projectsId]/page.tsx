'use client'

import { useEffect, useState } from 'react'
import ProjectDetails from '@/components/talent-dashboard/projects/projectDetails'
import { userApi } from '@/lib/services/api'
import { useParams, useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookies'

export default function ProjectDetailsPage() {
  const id = useParams<{ projectsId: string | string[] }>()
  const [project, setProject] = useState<any>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function fetchProject() {
      try {
        const token = getCookie('token')
        if (token) {
          const data = await userApi.getProjectDetail(id.projectsId)
          setProject(data.userData)
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id.projectsId])

  if (loading) return <p>Loading...</p>
  if (!project) return <p>Project not found</p>

  return <ProjectDetails projectId={id.projectsId} project={project} companyLogo="" />
}
