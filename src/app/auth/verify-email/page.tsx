import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">

      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Clin<span className="text-primary">OS</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Clinical Operating System
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <span className="text-4xl">📧</span>
          </div>
          <p className="text-base font-semibold text-center">Check your inbox</p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a confirmation link to{' '}
            {email ? (
              <span className="font-medium text-foreground">{decodeURIComponent(email)}</span>
            ) : (
              'your email address'
            )}
            .
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to activate your account and get started.
          </p>
          <p className="text-xs text-muted-foreground">
            Can&apos;t find it? Check your spam or junk folder.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
