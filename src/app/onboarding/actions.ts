'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const specialty = (formData.get('specialty') as string) || null
  const hospital  = (formData.get('hospital')  as string) || null
  const country   = (formData.get('country')   as string) || null

  const { error } = await supabase
    .from('profiles')
    .update({ specialty, hospital, country, onboarded: true })
    .eq('id', user.id)

  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`)

  redirect('/dashboard')
}
