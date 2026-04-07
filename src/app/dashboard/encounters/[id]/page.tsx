import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WORKFLOW_STEP_ORDER, WORKFLOW_STEPS } from '@/lib/design-tokens'
import type { Database } from '@/lib/supabase/types'

type Encounter     = Database['public']['Tables']['encounters']['Row']
type EncounterStep = Database['public']['Tables']['encounter_steps']['Row']

const STEP_ORDER = WORKFLOW_STEP_ORDER

// ── Severity display helpers ────────────────────────────────────
const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', cls: 'severity-critical', dot: 'bg-red-500 animate-pulse' },
  unstable: { label: 'UNSTABLE', cls: 'severity-unstable', dot: 'bg-amber-400 animate-pulse' },
  stable:   { label: 'STABLE',   cls: 'severity-stable',   dot: 'bg-emerald-400' },
  unknown:  { label: 'UNKNOWN',  cls: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
} as const

const ARRIVAL_LABELS: Record<string, string> = {
  walk_in:   'Walk-in',
  ambulance: 'Ambulance',
  referred:  'Referred',
  transfer:  'Transfer',
}

export default async function EncounterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ── Fetch encounter ────────────────────────────────────────────
  const { data: encounter } = await supabase
    .from('encounters')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: Encounter | null }

  if (!encounter) notFound()

  // ── Fetch steps ────────────────────────────────────────────────
  const { data: steps } = await supabase
    .from('encounter_steps')
    .select('*')
    .eq('encounter_id', id) as { data: EncounterStep[] | null }

  const completedSteps = new Set((steps ?? []).map((s) => s.step))
  const triageData     = (steps ?? []).find((s) => s.step === 'triage')?.data as Record<string, string> | undefined

  const sev    = SEVERITY_CONFIG[encounter.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.unknown
  const stepNr = STEP_ORDER.indexOf(encounter.current_step) + 1

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* ── Top nav ───────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Dashboard
          </a>
          <span className="text-xs font-mono text-muted-foreground">
            {new Date(encounter.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>

        {/* ── Encounter header ──────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${sev.dot}`} />
            <Badge className={sev.cls}>{sev.label}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{encounter.mode.toUpperCase()}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-snug">
            {encounter.chief_complaint}
          </h1>
          <p className="text-muted-foreground text-sm">
            {encounter.condition_key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
        </div>

        {/* ── Workflow progress ─────────────────────────────── */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Progress — Step {stepNr} of 8
          </p>
          <div className="flex gap-1.5">
            {STEP_ORDER.map((key, i) => {
              const done    = completedSteps.has(key)
              const current = key === encounter.current_step
              return (
                <div key={key} className="flex-1 flex flex-col items-center gap-1">
                  <div className={[
                    'h-1.5 w-full rounded-full',
                    done    ? 'bg-primary'              :
                    current ? 'bg-primary/40 animate-pulse' :
                              'bg-muted',
                  ].join(' ')} />
                  <span className={[
                    'text-[10px] font-mono hidden sm:block',
                    done || current ? 'text-foreground' : 'text-muted-foreground',
                  ].join(' ')}>
                    {i + 1}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-1.5">
            {STEP_ORDER.map((key) => {
              const step = WORKFLOW_STEPS[key]
              const done = completedSteps.has(key)
              const current = key === encounter.current_step
              return (
                <div key={key} className="flex-1 text-center">
                  <span className={[
                    'text-[9px] font-medium hidden sm:block leading-tight',
                    done    ? 'text-primary'    :
                    current ? 'text-foreground' :
                              'text-muted-foreground/50',
                  ].join(' ')}>
                    {step?.short ?? key}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Triage summary ────────────────────────────────── */}
        <Card className="border-border bg-card">
          <CardContent className="pt-5 pb-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Triage Summary
              </span>
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                ✓ Complete
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Severity</p>
                <p className="font-medium capitalize text-foreground">{encounter.severity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Arrival</p>
                <p className="font-medium text-foreground">
                  {ARRIVAL_LABELS[triageData?.arrival_mode ?? ''] ?? triageData?.arrival_mode ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Setting</p>
                <p className="font-medium uppercase text-foreground">{encounter.mode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Condition</p>
                <p className="font-medium text-foreground">
                  {encounter.condition_key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Next step CTA ─────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Next
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button className="w-full h-12 text-base font-semibold" disabled>
            Step 2 — History Taking (coming soon)
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            History taking module is next in the build queue
          </p>
        </div>

      </div>
    </div>
  )
}
