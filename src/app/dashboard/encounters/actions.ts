'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Database } from '@/lib/supabase/types'

export type TriageState = { error?: string } | null

type EncounterRow = Database['public']['Tables']['encounters']['Row']

export async function createEncounter(
  _prevState: TriageState,
  formData: FormData
): Promise<TriageState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const chiefComplaint = (formData.get('chief_complaint') as string)?.trim()
  const conditionKey   = (formData.get('condition_key')   as string) || 'chest_pain'
  const mode           = (formData.get('mode')            as string) || 'er'
  const severity       = (formData.get('severity')        as string)
  const arrivalMode    = (formData.get('arrival_mode')    as string) || 'walk_in'
  const patientSex     = (formData.get('patient_sex')     as string) || 'unknown'
  const patientAgeRaw  =  formData.get('patient_age')     as string | null
  const patientAge     = patientAgeRaw ? parseInt(patientAgeRaw, 10) : null

  // ── Validation ────────────────────────────────────────────────────────────
  if (!chiefComplaint) return { error: 'Chief complaint is required.' }
  if (!severity || !['critical', 'unstable', 'stable'].includes(severity)) {
    return { error: 'Please select a severity level.' }
  }
  if (patientAge !== null && (isNaN(patientAge) || patientAge < 1 || patientAge > 120)) {
    return { error: 'Patient age must be between 1 and 120.' }
  }

  // ── Create encounter ──────────────────────────────────────────────────────
  // Cast to 'any' on input: Supabase TS client returns 'never' for
  // Insert unless the Database interface includes Views/Functions/Enums.
  // We assert the result type explicitly instead.
  const { data: encounter, error: encounterError } = await supabase
    .from('encounters')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      user_id:         user.id,
      chief_complaint: chiefComplaint,
      condition_key:   conditionKey,
      mode:            mode,
      severity:        severity,
      critical_mode:   severity === 'critical',
      current_step:    'history',
      status:          'active',
      patient_age:     patientAge,
      patient_sex:     patientSex,
    } as any)
    .select()
    .single() as { data: EncounterRow | null; error: { message: string } | null }

  if (encounterError || !encounter) {
    console.error('createEncounter:', encounterError)
    return { error: encounterError?.message ?? 'Failed to create encounter.' }
  }

  // ── Record triage step ────────────────────────────────────────────────────
  await supabase
    .from('encounter_steps')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      encounter_id: encounter.id,
      step:         'triage',
      data: {
        chief_complaint: chiefComplaint,
        condition_key:   conditionKey,
        mode:            mode,
        severity:        severity,
        arrival_mode:    arrivalMode,
        patient_age:     patientAge,
        patient_sex:     patientSex,
      },
      completed_at: new Date().toISOString(),
    } as any)

  redirect(`/dashboard/encounters/${encounter.id}`)
}
