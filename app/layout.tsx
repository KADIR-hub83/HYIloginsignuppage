import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { AppProvider } from '@/context/appContext' // ✅ Updated to use `AppProvider`

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'HYI.AI - Find Your Next Opportunity',
  description: 'Connect with top companies and showcase your talents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <AppProvider> 
            {children}
          </AppProvider>
          <Toaster />
      </body>
    </html>
  )
}

