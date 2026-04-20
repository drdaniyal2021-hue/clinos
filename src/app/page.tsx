import { Button } from '@/components/ui/button'
import Link from 'next/link'

const VALUE_PROPS = [
  {
    icon: '🧭',
    title: '8-Step Guided Workflow',
    body:  'Every encounter follows the same structure: Triage → History → Examination → Investigations → Differentials → Diagnosis → Management → Documentation. No step gets skipped.',
  },
  {
    icon: '⚡',
    title: 'AI Decision Support',
    body:  'Real-time differentials, must-not-miss flags, and evidence-based management plans — all surfaced at the right moment, for 20+ clinical conditions.',
  },
  {
    icon: '🩺',
    title: 'Built for Junior Doctors',
    body:  'Designed for the pace of ER and ward medicine. Not a textbook, not a search engine — a working OS for the clinician at the bedside.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="text-xl font-bold tracking-tight">
          Clin<span className="text-primary">OS</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up Free</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 space-y-6">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Clinical Operating System
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Every patient encounter,<br />done right — every time.
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            ClinOS guides junior doctors through the full clinical workflow — from triage to discharge documentation — with AI decision support built in at every step.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
              Sign In
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-1">
          Free during beta · No card required
        </p>
      </section>

      {/* Value Props */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.title}
              className="bg-card border border-border rounded-xl p-6 space-y-3"
            >
              <span className="text-3xl">{vp.icon}</span>
              <p className="font-semibold text-foreground text-sm">{vp.title}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{vp.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          ClinOS provides clinical decision support only. Always apply independent clinical judgement.
        </p>
      </footer>

    </div>
  )
}
