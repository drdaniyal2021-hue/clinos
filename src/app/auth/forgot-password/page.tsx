import { forgotPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface ForgotPasswordPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { error, message } = await searchParams

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
        <CardHeader className="pb-4">
          <p className="text-sm font-medium text-center">Reset your password</p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Error / success messages */}
          {error && (
            <div className="severity-critical rounded-md px-3 py-2 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}
          {message && (
            <div className="severity-stable rounded-md px-3 py-2 text-sm">
              {decodeURIComponent(message)}
            </div>
          )}

          {/* Email form */}
          <form action={forgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@hospital.com"
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Remembered it?{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>

        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        ClinOS provides clinical decision support only.
        Always apply independent clinical judgement.
      </p>
    </div>
  )
}
