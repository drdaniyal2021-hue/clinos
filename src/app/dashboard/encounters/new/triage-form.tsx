'use client'

import { useActionState, useState } from 'react'
import { createEncounter, type TriageState } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ── Types ───────────────────────────────────────────────────────
type Condition = {
  key: string
  display_name: string
  category: string
  phase: number
}

type SeverityLevel = 'critical' | 'unstable' | 'stable'

// ── Severity card config ─────────────────────────────────────────
const SEVERITY_OPTIONS: {
  value: SeverityLevel
  label: string
  blurb: string
  base: string
  active: string
  dot: string
}[] = [
  {
    value:  'critical',
    label:  'Critical',
    blurb:  'Immediate life-threat. Resus bay.',
    base:   'border-red-800/60 bg-red-950/30 hover:border-red-600/80',
    active: 'border-red-500 bg-red-950/70 ring-2 ring-red-500/50 shadow-lg shadow-red-950/40',
    dot:    'bg-red-500',
  },
  {
    value:  'unstable',
    label:  'Unstable',
    blurb:  'Urgent. High deterioration risk.',
    base:   'border-amber-800/60 bg-amber-950/30 hover:border-amber-600/80',
    active: 'border-amber-500 bg-amber-950/70 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/40',
    dot:    'bg-amber-400',
  },
  {
    value:  'stable',
    label:  'Stable',
    blurb:  'Non-urgent. Systematic workup.',
    base:   'border-emerald-800/60 bg-emerald-950/30 hover:border-emerald-600/80',
    active: 'border-emerald-500 bg-emerald-950/70 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/40',
    dot:    'bg-emerald-400',
  },
]

// ── Arrival mode options ─────────────────────────────────────────
const ARRIVAL_MODES = [
  { value: 'walk_in',   label: 'Walk-in' },
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'referred',  label: 'Referred' },
  { value: 'transfer',  label: 'Transfer' },
]

// ── Clinical setting options ─────────────────────────────────────
const SETTINGS = [
  { value: 'er',   label: 'Emergency' },
  { value: 'ward', label: 'Ward' },
  { value: 'icu',  label: 'ICU' },
]

// ── Component ────────────────────────────────────────────────────
export function TriageForm({ conditions }: { conditions: Condition[] }) {
  const [severity, setSeverity]       = useState<SeverityLevel | ''>('')
  const [arrivalMode, setArrivalMode] = useState('walk_in')
  const [setting, setSetting]         = useState('er')
  const [conditionKey, setConditionKey] = useState('chest_pain')

  const [state, action, pending] = useActionState<TriageState, FormData>(
    createEncounter,
    null
  )

  // Group conditions by category for the select
  const byCategory = conditions.reduce<Record<string, Condition[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})

  return (
    <form action={action} className="space-y-8">

      {/* Hidden inputs for controlled values */}
      <input type="hidden" name="severity"      value={severity} />
      <input type="hidden" name="arrival_mode"  value={arrivalMode} />
      <input type="hidden" name="mode"          value={setting} />
      <input type="hidden" name="condition_key" value={conditionKey} />

      {/* ── 1. Severity ─────────────────────────────────── */}
      <section className="space-y-3">
        <Label className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Severity <span className="text-red-400">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSeverity(opt.value)}
              className={[
                'relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left',
                'transition-all duration-150 cursor-pointer',
                severity === opt.value ? opt.active : opt.base,
              ].join(' ')}
            >
              <span className={`h-3 w-3 rounded-full ${opt.dot} ${severity === opt.value ? 'animate-pulse' : ''}`} />
              <span className="font-semibold text-foreground text-sm">{opt.label}</span>
              <span className="text-xs text-muted-foreground leading-snug">{opt.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 2. Chief Complaint ──────────────────────────── */}
      <section className="space-y-2">
        <Label htmlFor="chief_complaint" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Chief Complaint <span className="text-red-400">*</span>
        </Label>
        <Input
          id="chief_complaint"
          name="chief_complaint"
          placeholder="e.g. Crushing central chest pain radiating to left arm, onset 2 hours ago"
          className="h-12 text-base bg-card border-border focus:border-primary"
          maxLength={300}
          required
        />
      </section>

      {/* ── 3. Condition ────────────────────────────────── */}
      <section className="space-y-2">
        <Label className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Clinical Condition
        </Label>
        <Select value={conditionKey} onValueChange={(v) => v && setConditionKey(v)}>
          <SelectTrigger className="h-12 bg-card border-border focus:border-primary">
            <SelectValue placeholder="Select condition…" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {Object.entries(byCategory).map(([category, items]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {items.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.display_name}
                    {c.phase === 1 && (
                      <span className="ml-2 text-xs text-primary font-medium">Phase 1</span>
                    )}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* ── 4. Clinical Setting + Arrival Mode ──────────── */}
      <div className="grid grid-cols-2 gap-6">

        <section className="space-y-2">
          <Label className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Clinical Setting
          </Label>
          <div className="flex gap-2">
            {SETTINGS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSetting(s.value)}
                className={[
                  'flex-1 rounded-lg border py-2 text-xs font-medium transition-all',
                  setting === s.value
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/50',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <Label className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Arrival Mode
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {ARRIVAL_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setArrivalMode(m.value)}
                className={[
                  'rounded-lg border py-2 text-xs font-medium transition-all',
                  arrivalMode === m.value
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/50',
                ].join(' ')}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* ── Error ───────────────────────────────────────── */}
      {state?.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={pending || !severity}
        className="w-full h-12 text-base font-semibold"
      >
        {pending ? 'Opening encounter…' : 'Start Encounter →'}
      </Button>

    </form>
  )
}
