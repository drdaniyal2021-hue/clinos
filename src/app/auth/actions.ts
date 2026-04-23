'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ─── Sign Up ──────────────────────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email     = formData.get('email') as string
  const password  = formData.get('password') as string
  const fullName  = formData.get('full_name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`)

  redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`)
}

// ─── Sign In ──────────────────────────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// ─── Magic Link ───────────────────────────────────────────────────────────────
export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  redirect('/login?message=Magic link sent — check your email')
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/reset-password`,
  })

  if (error) redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`)

  redirect(`/auth/forgot-password?message=Reset link sent — check your email`)
}

// ─── Reset Password ───────────────────────────────────────────────────────────
export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirm  = formData.get('confirm') as string

  if (password !== confirm) {
    redirect(`/auth/reset-password?error=${encodeURIComponent('Passwords do not match')}`)
  }

  const client = supabase as any
  const { error } = await client.auth.updateUser({ password }) as { error: { message: string } | null }

  if (error) redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
