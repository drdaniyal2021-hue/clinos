import { signUp } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface SignupPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, message } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Clin<span className="text-primary">OS</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create your free account
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <p className="text-sm font-medium text-center">Join ClinOS — it&apos;s free</p>
        </CardHeader>
        <CardContent className="space-y-4">

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

          <form action={signUp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Dr. Jane Smith"
                required
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">I am a...</Label>
              <Select name="role" defaultValue="junior_doctor">
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior_doctor">Junior Doctor</SelectItem>
                  <SelectItem value="medical_student">Medical Student</SelectItem>
                  <SelectItem value="registrar">Registrar / Resident</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>

        </CardContent>
      </Card>

    </div>
  )
}
