import { signIn, signInWithMagicLink } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface LoginPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
          <p className="text-sm font-medium text-center">Sign in to your account</p>
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

          {/* Email + Password */}
          <form action={signIn} className="space-y-4">
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
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Magic Link */}
          <form action={signInWithMagicLink} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="magic-email">Email (magic link)</Label>
              <Input
                id="magic-email"
                name="email"
                type="email"
                placeholder="you@hospital.com"
                autoComplete="email"
              />
            </div>
            <Button type="submit" variant="outline" className="w-full">
              Send Magic Link
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            No account?{' '}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up free
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
