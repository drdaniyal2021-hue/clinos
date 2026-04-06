import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEVERITY, WORKFLOW_STEPS, WORKFLOW_STEP_ORDER } from "@/lib/design-tokens";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-10">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            Clin<span className="text-primary">OS</span>
          </span>
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            Design System Preview
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Clinical Operating System — design tokens, severity levels, and workflow steps
        </p>
      </div>

      {/* Color Palette */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Brand Colors
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Navy",       bg: "bg-[#0D2137]",  text: "#0D2137"  },
            { name: "Teal",       bg: "bg-[#00695C]",  text: "#00695C"  },
            { name: "Teal Light", bg: "bg-[#00897B]",  text: "#00897B"  },
            { name: "Red",        bg: "bg-[#C62828]",  text: "#C62828"  },
            { name: "Amber",      bg: "bg-[#E65100]",  text: "#E65100"  },
          ].map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-1.5">
              <div className={`${c.bg} w-14 h-14 rounded-lg border border-border`} />
              <span className="text-[10px] text-muted-foreground font-mono">{c.text}</span>
              <span className="text-[10px] text-foreground">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Severity Levels */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Clinical Severity
        </h2>
        <div className="flex flex-wrap gap-3">
          {(["critical", "unstable", "stable"] as const).map((level) => {
            const s = SEVERITY[level];
            return (
              <div
                key={level}
                className={`${s.bgClass} px-4 py-3 rounded-lg flex items-center gap-2.5 min-w-[140px]`}
              >
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className={`${s.textClass} font-bold text-sm tracking-wide`}>
                    {s.label}
                  </p>
                  <p className="text-xs opacity-70">Triage level</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8-Step Workflow */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          8-Step Workflow
        </h2>
        <div className="flex flex-wrap gap-2">
          {WORKFLOW_STEP_ORDER.map((key, i) => {
            const step = WORKFLOW_STEPS[key];
            const isFirst = i === 0;
            return (
              <div
                key={key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
                  ${isFirst
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground"
                  }`}
              >
                <span className="font-mono text-xs opacity-60">{step.step}</span>
                <span className="font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Component Samples */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Components
        </h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button>Start Encounter</Button>
          <Button variant="outline">View History</Button>
          <Button variant="destructive">CRITICAL MODE</Button>
          <Button variant="secondary">Export SOAP Note</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-2">
          <Badge>Stable</Badge>
          <Badge variant="destructive">Critical</Badge>
          <Badge variant="outline">ACS</Badge>
          <Badge variant="secondary">STAT</Badge>
        </div>
      </section>

      {/* Sample Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-primary">●</span> Patient Encounter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Male, 58 years · Chest Pain · Arrived 14:32
            </p>
            <div className="mt-3 flex gap-2">
              <Badge className="severity-critical text-[length:10px]">UNSTABLE</Badge>
              <Badge variant="outline" className="text-[length:10px]">ER Mode</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-[var(--severity-unstable)]">●</span> Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: "HR",  value: "118 bpm",    flag: true  },
              { label: "BP",  value: "88/56 mmHg", flag: true  },
              { label: "SpO₂", value: "94%",       flag: false },
              { label: "RR",  value: "22 /min",    flag: false },
            ].map((v) => (
              <div key={v.label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{v.label}</span>
                <span className={`clinical-value font-medium ${v.flag ? "text-[var(--severity-critical)]" : "text-foreground"}`}>
                  {v.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-primary">●</span> Top DDx
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {[
              { dx: "STEMI",           tier: "Must Not Miss" },
              { dx: "NSTEMI / UA",     tier: "Likely"        },
              { dx: "Aortic Dissect.", tier: "Must Not Miss" },
            ].map((d) => (
              <div key={d.dx} className="flex justify-between text-xs">
                <span className="text-foreground font-medium">{d.dx}</span>
                <span className={`text-[length:10px] ${
                  d.tier === "Must Not Miss"
                    ? "text-[var(--severity-critical)]"
                    : "text-primary"
                }`}>{d.tier}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
