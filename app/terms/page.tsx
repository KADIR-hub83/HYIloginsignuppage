'use client'

import { Logo } from '@/components/navigation/logo'
import { ThemeToggle } from '@/components/navigation/theme-toggle'
import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Users, Lock } from 'lucide-react'

export default function Terms() {
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
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>

        <div className="text-muted-foreground mb-8">Last updated: April 1, 2025</div>

        <div className="grid gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Shield className="h-5 w-5 text-primary" />
              <h2>1. Introduction</h2>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                Welcome to HYI.AI ("Company", "we", "our", "us")! These Terms of Service govern your
                use of our website and services. By accessing or using our services, you agree to be
                bound by these terms.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Users className="h-5 w-5 text-primary" />
              <h2>2. User Accounts</h2>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                When you create an account with us, you must provide accurate and complete
                information. You are responsible for maintaining the security of your account and
                for all activities that occur under your account.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Lock className="h-5 w-5 text-primary" />
              <h2>3. Privacy & Security</h2>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy to understand how
                we collect, use, and protect your personal information. By using our services, you
                agree to our data practices as described in the Privacy Policy.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            If you have any questions about these Terms of Service, please{' '}
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
