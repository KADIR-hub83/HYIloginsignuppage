'use client'

import { Logo } from '@/components/navigation/logo'
import { ThemeToggle } from '@/components/navigation/theme-toggle'
import Link from 'next/link'
import { ArrowLeft, Shield, Database, Lock, Eye, Bell } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo themeSwitch />
          {/* <div className="flex items-center gap-4">
            <ThemeToggle />
          </div> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>

        <div className="text-muted-foreground mb-8">Last updated: April 1, 2025</div>

        <div className="grid gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Database className="h-5 w-5 text-primary" />
              <h2>1. Information We Collect</h2>
            </div>
            <div className="pl-7 space-y-4">
              <p className="text-muted-foreground">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Register for an account</li>
                <li>Create or modify your profile</li>
                <li>Apply for jobs through our platform</li>
                <li>Communicate with other users</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Eye className="h-5 w-5 text-primary" />
              <h2>2. How We Use Your Information</h2>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our services, to
                develop new features, and to protect our Company and our users. This includes
                personalizing your job search experience and matching you with relevant
                opportunities.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Lock className="h-5 w-5 text-primary" />
              <h2>3. Data Security</h2>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to maintain the
                security of your personal information, including encryption of sensitive data and
                regular security assessments.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Bell className="h-5 w-5 text-primary" />
              <h2>4. Your Privacy Choices</h2>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                You have control over your personal information. You can access, update, or delete
                your account information at any time through your account settings. You can also
                opt-out of non-essential communications.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            For questions about our privacy practices, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
