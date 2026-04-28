import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, onboarded')
    .eq('id', user.id)
    .single() as { data: Pick<Profile, 'full_name' | 'onboarded'> | null }

  if (!profile?.onboarded) redirect('/onboarding')

  const displayName = profile?.full_name || user.email || 'Doctor'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background">

      {/* Persistent top nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight">
              Clin<span className="text-primary">OS</span>
            </span>
          </Link>

          {/* Right: user + actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Avatar + name */}
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </span>
              <span className="hidden sm:inline text-sm font-medium text-foreground max-w-[140px] truncate">
                {displayName}
              </span>
            </Link>

            {/* Settings */}
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground">
                Settings
              </Button>
            </Link>

            {/* Sign Out */}
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
                Sign out
              </Button>
            </form>

          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>
        {children}
      </main>

    </div>
  )
}
