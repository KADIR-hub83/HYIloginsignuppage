'use client'

// import ReCaptchaProvider from '@/components/utils/reCaptchaProvider'
// import NextNProgress from 'nextjs-progressbar'
// import { usePathname } from 'next/navigation'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname()
  return (
    <>
      <main>{children}</main>
    </>
  )
}
