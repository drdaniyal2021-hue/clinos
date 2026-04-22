'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const specialty = (formData.get('specialty') as string) || null
  const hospital  = (formData.get('hospital')  as string) || null
  const country   = (formData.get('country')   as string) || null

  // @supabase/ssr generic limitation: .update() resolves to never on this client type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any
  const { error } = await client
    .from('profiles')
    .update({ specialty, hospital, country, onboarded: true })
    .eq('id', user.id) as { error: { message: string } | null }

  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`)

  redirect('/dashboard')
}
