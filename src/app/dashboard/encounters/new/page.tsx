import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TriageForm } from './triage-form'

export const metadata = {
  title: 'New Encounter — Triage | ClinOS',
}

export default async function NewEncounterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conditions } = await supabase
    .from('conditions')
    .select('key, display_name, category, phase')
    .eq('active', true)
    .order('phase', { ascending: true })
    .order('display_name', { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Step label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Step 1 of 8
          </span>
          <span className="h-px flex-1 bg-border" />
          <a
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Dashboard
          </a>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Clin<span className="text-primary">OS</span>
          </h1>
          <p className="text-xl font-semibold text-foreground mt-1">Triage Assessment</p>
          <p className="text-muted-foreground text-sm mt-1">
            Initial evaluation — opens a new clinical encounter
          </p>
        </div>

        <TriageForm conditions={conditions ?? []} />

      </div>
    </div>
  )
}
