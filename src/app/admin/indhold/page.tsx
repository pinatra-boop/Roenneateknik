"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { CONTENT_DEFAULTS, type ContentMap } from "@/lib/content";

type Tab = "global" | "hero" | "why_us" | "booking_cta" | "about";

const TABS: { key: Tab; label: string }[] = [
  { key: "global", label: "Generelt" },
  { key: "hero", label: "Forside – Hero" },
  { key: "why_us", label: "Forside – Hvorfor os" },
  { key: "booking_cta", label: "Forside – Book CTA" },
  { key: "about", label: "Om Os" },
];

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-text text-sm focus:border-accent focus:outline-none"
        />
      )}
      {hint && <p className="text-xs text-text-muted/60 mt-1">{hint}</p>}
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-light rounded-2xl border border-border overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-light/30 transition-colors"
      >
        <span className="font-semibold text-text text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">{children}</div>}
    </div>
  );
}

export default function IndholdPage() {
  const [activeTab, setActiveTab] = useState<Tab>("global");
  const [content, setContent] = useState<ContentMap>(CONTENT_DEFAULTS);
  const [saving, setSaving] = useState<Tab | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const save = useCallback(
    async (key: Tab) => {
      setSaving(key);
      try {
        const res = await fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: content[key] }),
        });
        if (res.ok) toast.success("Gemt!");
        else toast.error("Fejl ved gemning");
      } finally {
        setSaving(null);
      }
    },
    [content]
  );

  const update = useCallback(
    <K extends Tab>(tab: K, path: string, value: unknown) => {
      setContent((prev) => {
        const section = { ...(prev[tab] as unknown as Record<string, unknown>) };
        const keys = path.split(".");
        if (keys.length === 1) {
          section[keys[0]] = value;
        } else if (keys.length === 3 && !isNaN(Number(keys[1]))) {
          const arr = [...(section[keys[0]] as unknown[])] as Record<string, unknown>[];
          arr[Number(keys[1])] = { ...arr[Number(keys[1])], [keys[2]]: value };
          section[keys[0]] = arr;
        }
        return { ...prev, [tab]: section };
      });
    },
    []
  );

  const addItem = useCallback(<K extends Tab>(tab: K, field: string, template: Record<string, unknown>) => {
    setContent((prev) => {
      const section = { ...(prev[tab] as unknown as Record<string, unknown>) };
      section[field] = [...(section[field] as unknown[]), { ...template }];
      return { ...prev, [tab]: section };
    });
  }, []);

  const removeItem = useCallback(<K extends Tab>(tab: K, field: string, index: number) => {
    setContent((prev) => {
      const section = { ...(prev[tab] as unknown as Record<string, unknown>) };
      const arr = [...(section[field] as unknown[])];
      arr.splice(index, 1);
      section[field] = arr;
      return { ...prev, [tab]: section };
    });
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  const SaveBtn = ({ tab }: { tab: Tab }) => (
    <button
      onClick={() => save(tab)}
      disabled={saving === tab}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold text-sm disabled:opacity-60 transition-colors"
    >
      {saving === tab ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      Gem sektion
    </button>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading">Indhold</h1>
        <p className="text-text-muted text-sm">Rediger tekst, knapper og lister på hele hjemmesiden</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-accent text-white"
                : "bg-surface-light border border-border text-text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GENERELT ── */}
      {activeTab === "global" && (
        <div>
          <Section title="Kontaktoplysninger">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tagline (under logo)" value={content.global.tagline} onChange={(v) => update("global", "tagline", v)} />
              <Field label="Telefon (visning)" value={content.global.phone} onChange={(v) => update("global", "phone", v)} hint='F.eks. "56 00 00 00"' />
              <Field label="Telefon (rå – til tel: link)" value={content.global.phoneRaw} onChange={(v) => update("global", "phoneRaw", v)} hint='F.eks. "+4556000000"' />
              <Field label="Email" value={content.global.email} onChange={(v) => update("global", "email", v)} />
              <Field label="Adresse" value={content.global.address} onChange={(v) => update("global", "address", v)} />
            </div>
          </Section>

          <Section title="Åbningstider">
            <div className="space-y-2">
              {content.global.openingHours.map((row, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <Field label={i === 0 ? "Dag" : ""} value={row.day} onChange={(v) => update("global", `openingHours.${i}.day`, v)} />
                  <Field label={i === 0 ? "Tidspunkt" : ""} value={row.hours} onChange={(v) => update("global", `openingHours.${i}.hours`, v)} />
                </div>
              ))}
            </div>
          </Section>

          <div className="flex justify-end mt-2">
            <SaveBtn tab="global" />
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      {activeTab === "hero" && (
        <div>
          <Section title="Badge & overskrift">
            <Field label="Badge-tekst (øverst)" value={content.hero.badge} onChange={(v) => update("hero", "badge", v)} />
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label='Overskrift linje 1' value={content.hero.heading1} onChange={(v) => update("hero", "heading1", v)} />
              <Field label='Overskrift linje 2 (gradient)' value={content.hero.heading2} onChange={(v) => update("hero", "heading2", v)} />
              <Field label='Overskrift linje 3' value={content.hero.heading3} onChange={(v) => update("hero", "heading3", v)} />
            </div>
            <Field label="Undertekst" value={content.hero.subtext} onChange={(v) => update("hero", "subtext", v)} multiline />
          </Section>

          <Section title="Knapper">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Primær knap" value={content.hero.ctaPrimary} onChange={(v) => update("hero", "ctaPrimary", v)} />
              <Field label="Sekundær knap" value={content.hero.ctaSecondary} onChange={(v) => update("hero", "ctaSecondary", v)} />
            </div>
          </Section>

          <Section title="Statistikker">
            {content.hero.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 items-end">
                <Field label={`Værdi ${i + 1}`} value={s.value} onChange={(v) => update("hero", `stats.${i}.value`, v)} />
                <div className="flex gap-2 items-end">
                  <Field label={`Label ${i + 1}`} value={s.label} onChange={(v) => update("hero", `stats.${i}.label`, v)} />
                  <button onClick={() => removeItem("hero", "stats", i)} className="p-2.5 mb-0.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("hero", "stats", { value: "", label: "" })} className="flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors">
              <Plus size={14} /> Tilføj statistik
            </button>
          </Section>

          <Section title="Tillids-badges (under knapper)">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Badge 1" value={content.hero.trustBadge1} onChange={(v) => update("hero", "trustBadge1", v)} />
              <Field label="Badge 2" value={content.hero.trustBadge2} onChange={(v) => update("hero", "trustBadge2", v)} />
            </div>
          </Section>

          <div className="flex justify-end mt-2">
            <SaveBtn tab="hero" />
          </div>
        </div>
      )}

      {/* ── WHY US ── */}
      {activeTab === "why_us" && (
        <div>
          <Section title="Overskrift & tekst">
            <Field label="Badge" value={content.why_us.badge} onChange={(v) => update("why_us", "badge", v)} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Overskrift" value={content.why_us.heading} onChange={(v) => update("why_us", "heading", v)} />
              <Field label="Overskrift (gradient-ord)" value={content.why_us.headingGradient} onChange={(v) => update("why_us", "headingGradient", v)} />
            </div>
            <Field label="Undertekst" value={content.why_us.subtext} onChange={(v) => update("why_us", "subtext", v)} multiline />
          </Section>

          <Section title="Procent-bjælker">
            {content.why_us.progressBars.map((bar, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2">
                  <Field label={`Label ${i + 1}`} value={bar.label} onChange={(v) => update("why_us", `progressBars.${i}.label`, v)} />
                </div>
                <div className="flex gap-2 items-end">
                  <Field label="%" value={String(bar.value)} onChange={(v) => update("why_us", `progressBars.${i}.value`, Number(v))} />
                  <button onClick={() => removeItem("why_us", "progressBars", i)} className="p-2.5 mb-0.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("why_us", "progressBars", { label: "", value: 0 })} className="flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors">
              <Plus size={14} /> Tilføj bjælke
            </button>
          </Section>

          <Section title="Punktkort (6 kort)">
            {content.why_us.reasons.map((r, i) => (
              <div key={i} className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">Kort {i + 1}</span>
                  <button onClick={() => removeItem("why_us", "reasons", i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <Field label="Titel" value={r.title} onChange={(v) => update("why_us", `reasons.${i}.title`, v)} />
                <Field label="Beskrivelse" value={r.description} onChange={(v) => update("why_us", `reasons.${i}.description`, v)} multiline />
              </div>
            ))}
            <button onClick={() => addItem("why_us", "reasons", { title: "", description: "" })} className="flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors">
              <Plus size={14} /> Tilføj kort
            </button>
          </Section>

          <div className="flex justify-end mt-2">
            <SaveBtn tab="why_us" />
          </div>
        </div>
      )}

      {/* ── BOOKING CTA ── */}
      {activeTab === "booking_cta" && (
        <div>
          <Section title="Tekst & knapper">
            <Field label="Overskrift" value={content.booking_cta.heading} onChange={(v) => update("booking_cta", "heading", v)} />
            <Field label="Undertekst" value={content.booking_cta.subtext} onChange={(v) => update("booking_cta", "subtext", v)} multiline />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Primær knap" value={content.booking_cta.ctaPrimary} onChange={(v) => update("booking_cta", "ctaPrimary", v)} />
              <Field label="Sekundær knap (med tlf.)" value={content.booking_cta.ctaSecondary} onChange={(v) => update("booking_cta", "ctaSecondary", v)} />
            </div>
            <Field label="Åbningstider (under knapper)" value={content.booking_cta.hoursText} onChange={(v) => update("booking_cta", "hoursText", v)} />
          </Section>

          <div className="flex justify-end mt-2">
            <SaveBtn tab="booking_cta" />
          </div>
        </div>
      )}

      {/* ── ABOUT ── */}
      {activeTab === "about" && (
        <div>
          <Section title="Hero-sektion">
            <Field label="Badge" value={content.about.badge} onChange={(v) => update("about", "badge", v)} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Overskrift" value={content.about.heading} onChange={(v) => update("about", "heading", v)} />
              <Field label="Overskrift (gradient-del)" value={content.about.headingGradient} onChange={(v) => update("about", "headingGradient", v)} />
            </div>
            <Field label="Tekst 1" value={content.about.text1} onChange={(v) => update("about", "text1", v)} multiline />
            <Field label="Tekst 2" value={content.about.text2} onChange={(v) => update("about", "text2", v)} multiline />
          </Section>

          <Section title="Statistikker (4 bokse)" defaultOpen={false}>
            {content.about.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 items-end">
                <Field label={`Værdi ${i + 1}`} value={s.value} onChange={(v) => update("about", `stats.${i}.value`, v)} />
                <div className="flex gap-2 items-end">
                  <Field label={`Label ${i + 1}`} value={s.label} onChange={(v) => update("about", `stats.${i}.label`, v)} />
                  <button onClick={() => removeItem("about", "stats", i)} className="p-2.5 mb-0.5 rounded-xl text-red-400 hover:bg-red-500/10 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("about", "stats", { value: "", label: "" })} className="flex items-center gap-2 text-sm text-accent">
              <Plus size={14} /> Tilføj statistik
            </button>
          </Section>

          <Section title="Historie & tidslinje" defaultOpen={false}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Overskrift" value={content.about.historyHeading} onChange={(v) => update("about", "historyHeading", v)} />
              <Field label="Undertekst" value={content.about.historySubtext} onChange={(v) => update("about", "historySubtext", v)} />
            </div>
            {content.about.milestones.map((m, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 items-end">
                <Field label={i === 0 ? "År" : ""} value={m.year} onChange={(v) => update("about", `milestones.${i}.year`, v)} />
                <div className="col-span-3 flex gap-2 items-end">
                  <Field label={i === 0 ? "Tekst" : ""} value={m.text} onChange={(v) => update("about", `milestones.${i}.text`, v)} />
                  <button onClick={() => removeItem("about", "milestones", i)} className="p-2.5 mb-0.5 rounded-xl text-red-400 hover:bg-red-500/10 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("about", "milestones", { year: "", text: "" })} className="flex items-center gap-2 text-sm text-accent">
              <Plus size={14} /> Tilføj milepæl
            </button>
          </Section>

          <Section title="Team" defaultOpen={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-2">
              <Field label="Teamets overskrift" value={content.about.teamHeading} onChange={(v) => update("about", "teamHeading", v)} />
              <Field label="Teamets undertekst" value={content.about.teamSubtext} onChange={(v) => update("about", "teamSubtext", v)} />
            </div>
            {content.about.team.map((member, i) => (
              <div key={i} className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">Teammedlem {i + 1}</span>
                  <button onClick={() => removeItem("about", "team", i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Navn" value={member.name} onChange={(v) => update("about", `team.${i}.name`, v)} />
                  <Field label="Titel/rolle" value={member.role} onChange={(v) => update("about", `team.${i}.role`, v)} />
                  <Field label="Erfaring" value={member.experience} onChange={(v) => update("about", `team.${i}.experience`, v)} />
                  <Field label="Speciale" value={member.specialty} onChange={(v) => update("about", `team.${i}.specialty`, v)} />
                </div>
              </div>
            ))}
            <button onClick={() => addItem("about", "team", { name: "", role: "", experience: "", specialty: "" })} className="flex items-center gap-2 text-sm text-accent">
              <Plus size={14} /> Tilføj teammedlem
            </button>
          </Section>

          <Section title="Værdier" defaultOpen={false}>
            <Field label="Værdier overskrift" value={content.about.valuesHeading} onChange={(v) => update("about", "valuesHeading", v)} />
            {content.about.values.map((val, i) => (
              <div key={i} className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">Værdi {i + 1}</span>
                  <button onClick={() => removeItem("about", "values", i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10">
                    <Trash2 size={13} />
                  </button>
                </div>
                <Field label="Titel" value={val.title} onChange={(v) => update("about", `values.${i}.title`, v)} />
                <Field label="Beskrivelse" value={val.desc} onChange={(v) => update("about", `values.${i}.desc`, v)} multiline />
              </div>
            ))}
            <button onClick={() => addItem("about", "values", { title: "", desc: "" })} className="flex items-center gap-2 text-sm text-accent">
              <Plus size={14} /> Tilføj værdi
            </button>
          </Section>

          <div className="flex justify-end mt-2">
            <SaveBtn tab="about" />
          </div>
        </div>
      )}
    </div>
  );
}
