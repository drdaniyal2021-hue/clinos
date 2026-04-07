import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WORKFLOW_STEP_ORDER, WORKFLOW_STEPS } from '@/lib/design-tokens'
import type { Database } from '@/lib/supabase/types'

type Profile   = Database['public']['Tables']['profiles']['Row']
type Encounter = Database['public']['Tables']['encounters']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null }

  const { data: encounters } = await supabase
    .from('encounters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5) as { data: Encounter[] | null }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Clin<span className="text-primary">OS</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back, {profile?.full_name || user.email}
          </p>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit">Sign out</Button>
        </form>
      </div>

      {/* Start Encounter CTA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">Start New Encounter</p>
            <p className="text-muted-foreground text-sm mt-0.5">
              Guide a patient through all 8 clinical steps
            </p>
          </div>
          <a href="/dashboard/encounters/new">
            <Button>New Encounter →</Button>
          </a>
        </CardContent>
      </Card>

      {/* 8-Step Workflow Overview */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          8-Step Workflow
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {WORKFLOW_STEP_ORDER.map((key) => {
            const step = WORKFLOW_STEPS[key]
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-card border border-border text-center"
              >
                <span className="text-xs font-mono text-muted-foreground">{step.step}</span>
                <span className="text-xs font-medium text-foreground leading-tight">{step.short}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent Encounters */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Recent Encounters
        </h2>
        {!encounters || encounters.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground text-sm">
              No encounters yet. Start your first one above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {encounters.map((enc: Encounter) => (
              <a key={enc.id} href={`/dashboard/encounters/${enc.id}`} className="block">
                <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{enc.chief_complaint}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {enc.condition_key.replace(/_/g, ' ')} · {enc.mode.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        enc.severity === 'critical' ? 'severity-critical' :
                        enc.severity === 'unstable' ? 'severity-unstable' :
                        enc.severity === 'stable'   ? 'severity-stable'   :
                        'bg-muted text-muted-foreground'
                      }>
                        {enc.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {enc.current_step}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
