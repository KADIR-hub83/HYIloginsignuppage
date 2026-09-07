'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Config Import
import { getCookie } from '@/lib/cookies'

export default function Home() {
  const router = useRouter()
  // const theme = localStorage.getItem('theme')

  // if (theme) localStorage.removeItem('theme')

  // useEffect(() => {
  //   // const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  //   const token = getCookie('token')
  //   if (token) {
  //     router.replace('/talent/dashboard')
  //   } else {
  //     router.replace('/login')
  //   }
  // }, [router])

  // return null
}
