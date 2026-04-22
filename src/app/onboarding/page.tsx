import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { saveOnboarding } from './actions'

type ProfileCheck = { onboarded: boolean; full_name: string | null }
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SPECIALTIES = [
  'Emergency Medicine',
  'Internal Medicine',
  'General Surgery',
  'Paediatrics',
  'Obstetrics & Gynaecology',
  'Cardiology',
  'Respiratory Medicine',
  'Gastroenterology',
  'Neurology',
  'Psychiatry',
  'Orthopaedics',
  'Anaesthesiology',
  'Intensive Care',
  'Radiology',
  'Family Medicine',
  'Other',
]

interface OnboardingPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded, full_name')
    .eq('id', user.id)
    .single() as { data: ProfileCheck | null }

  // Already onboarded — skip ahead
  if (profile?.onboarded) redirect('/dashboard')

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
          <p className="text-base font-semibold text-center">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Tell us a bit about where you work — takes 30 seconds.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">

          {error && (
            <div className="severity-critical rounded-md px-3 py-2 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={saveOnboarding} className="space-y-4">

            <div className="space-y-1.5">
              <Label htmlFor="specialty">Specialty</Label>
              <Select name="specialty" defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hospital">Hospital / Institution</Label>
              <Input
                id="hospital"
                name="hospital"
                type="text"
                placeholder="e.g. Royal London Hospital"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="e.g. United Kingdom"
              />
            </div>

            <Button type="submit" className="w-full">
              Let&apos;s go →
            </Button>

          </form>

        </CardContent>
      </Card>

    </div>
  )
}
