'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function saveSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const full_name = (formData.get('full_name') as string).trim() || null
  const specialty = (formData.get('specialty') as string) || null
  const hospital  = (formData.get('hospital')  as string).trim() || null
  const country   = (formData.get('country')   as string).trim() || null

  // @supabase/ssr generic limitation: .update() resolves to never on this client type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any
  const { error } = await client
    .from('profiles')
    .update({ full_name, specialty, hospital, country })
    .eq('id', user.id) as { error: { message: string } | null }

  if (error) redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`)

  redirect('/dashboard/settings?message=Profile updated successfully')
}
