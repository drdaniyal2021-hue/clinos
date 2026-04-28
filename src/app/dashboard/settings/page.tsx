import { createClient } from '@/lib/supabase/server'
import { saveSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

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

interface SettingsPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  // Auth + onboarding guards handled by dashboard/layout.tsx
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single() as { data: Profile | null }

  const { error, message } = await searchParams

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-xl font-bold">Profile Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{user!.email}</p>
      </div>

      <div className="max-w-sm space-y-4">

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

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Account details</p>
          </CardHeader>
          <CardContent>
            <form action={saveSettings} className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  defaultValue={profile?.full_name ?? ''}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specialty">Specialty</Label>
                <Select name="specialty" defaultValue={profile?.specialty ?? ''}>
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
                  defaultValue={profile?.hospital ?? ''}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="e.g. United Kingdom"
                  defaultValue={profile?.country ?? ''}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
