import { resetPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ResetPasswordPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { error } = await searchParams

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
          <p className="text-sm font-medium text-center">Choose a new password</p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Must be at least 8 characters.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Error message */}
          {error && (
            <div className="severity-critical rounded-md px-3 py-2 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          {/* New password form */}
          <form action={resetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Repeat your password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>

        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        ClinOS provides clinical decision support only.
        Always apply independent clinical judgement.
      </p>
    </div>
  )
}
