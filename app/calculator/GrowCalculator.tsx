'use client';

import { useMemo, useState } from 'react';

// ── Typen & Konstanten ──────────────────────────────────────
type PlantType = 'photo' | 'auto';
type Dominance = 'indica' | 'sativa' | 'hybrid';
type Training = 'none' | 'lst' | 'topping' | 'scrog';
type Skill = 'beginner' | 'advanced' | 'pro';

const BASELINE: Record<PlantType, number> = { photo: 1.2, auto: 0.95 };
const GENETIC: Record<Dominance, number> = { indica: 1.0, sativa: 0.9, hybrid: 1.05 };
const TRAINING: Record<Training, number> = { none: 0.85, lst: 1.0, topping: 1.15, scrog: 1.25 };
const SKILL: Record<Skill, number> = { beginner: 0.7, advanced: 1.0, pro: 1.25 };

const TOTAL_HOURS = 840; // 4 Wo Vegi (18h) + 8 Wo Blüte (12h)

const fmt = (n: number, d = 0) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

// ── Pflanzenanzahl-Empfehlung ───────────────────────────────
function recommendPlants(areaM2: number, training: Training): string {
  if (areaM2 <= 0) return '–';
  // Pflanzen pro m² je nach Trainingsmethode
  const density: Record<Training, number> = { none: 9, lst: 6, topping: 4, scrog: 2 };
  const perM2 = density[training];
  const raw = areaM2 * perM2;
  const min = Math.max(1, Math.floor(raw * 0.75));
  const max = Math.max(min, Math.round(raw));
  return min === max ? `${min}` : `${min}–${max}`;
}

// ── UI-Bausteine ────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors';

function SegButton<T extends string>({
  value,
  current,
  onClick,
  children,
}: {
  value: T;
  current: T;
  onClick: (v: T) => void;
  children: React.ReactNode;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={
        'px-3 py-2 rounded-lg text-sm font-medium border transition-colors ' +
        (active
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400')
      }
    >
      {children}
    </button>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
        {label}
      </div>
      <div
        className={
          'mt-1 text-2xl font-bold tracking-tight ' +
          (accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white')
        }
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{hint}</div>}
    </div>
  );
}

// ── Hauptkomponente ─────────────────────────────────────────
export default function GrowCalculator() {
  const [width, setWidth] = useState(80);
  const [depth, setDepth] = useState(80);
  const [watt, setWatt] = useState(240);
  const [price, setPrice] = useState(0.35);

  const [type, setType] = useState<PlantType>('photo');
  const [dominance, setDominance] = useState<Dominance>('hybrid');
  const [training, setTraining] = useState<Training>('lst');
  const [skill, setSkill] = useState<Skill>('advanced');

  const r = useMemo(() => {
    const areaM2 = (width * depth) / 10_000;
    const base = watt * BASELINE[type] * GENETIC[dominance] * TRAINING[training] * SKILL[skill];

    const min = base * 0.9;
    const max = base * 1.1;
    const gPerW = watt > 0 ? base / watt : 0;

    const cost = (watt * TOTAL_HOURS) / 1000 * price;
    const costPerG = base > 0 ? cost / base : 0;

    const wPerM2 = areaM2 > 0 ? watt / areaM2 : 0;
    let lightStatus: 'low' | 'ok' | 'high' = 'ok';
    if (wPerM2 < 250) lightStatus = 'low';
    else if (wPerM2 > 450) lightStatus = 'high';

    return {
      areaM2,
      min,
      max,
      gPerW,
      cost,
      costPerG,
      wPerM2,
      lightStatus,
      plants: recommendPlants(areaM2, training),
    };
  }, [width, depth, watt, price, type, dominance, training, skill]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── INPUTS ── */}
      <section className="space-y-8">
        {/* Setup */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Setup
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Zeltbreite (cm)">
              <input type="number" min={20} value={width} onChange={(e) => setWidth(+e.target.value)} className={inputCls} />
            </Field>
            <Field label="Zelttiefe (cm)">
              <input type="number" min={20} value={depth} onChange={(e) => setDepth(+e.target.value)} className={inputCls} />
            </Field>
            <Field label="LED-Leistung (Watt)">
              <input type="number" min={0} value={watt} onChange={(e) => setWatt(+e.target.value)} className={inputCls} />
            </Field>
            <Field label="Strompreis (€/kWh)">
              <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(+e.target.value)} className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Genetik */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Genetik
          </h2>
          <Field label="Typ">
            <div className="grid grid-cols-2 gap-2">
              <SegButton value="photo" current={type} onClick={setType}>Photoperiodisch</SegButton>
              <SegButton value="auto" current={type} onClick={setType}>Autoflower</SegButton>
            </div>
          </Field>
          <Field label="Dominanz">
            <div className="grid grid-cols-3 gap-2">
              <SegButton value="indica" current={dominance} onClick={setDominance}>Indica</SegButton>
              <SegButton value="sativa" current={dominance} onClick={setDominance}>Sativa</SegButton>
              <SegButton value="hybrid" current={dominance} onClick={setDominance}>Hybrid</SegButton>
            </div>
          </Field>
        </div>

        {/* Technik & Erfahrung */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Technik &amp; Erfahrung
          </h2>
          <Field label="Pflanzentraining">
            <div className="grid grid-cols-2 gap-2">
              <SegButton value="none" current={training} onClick={setTraining}>Keine (Natural)</SegButton>
              <SegButton value="lst" current={training} onClick={setTraining}>LST</SegButton>
              <SegButton value="topping" current={training} onClick={setTraining}>Topping / FIM</SegButton>
              <SegButton value="scrog" current={training} onClick={setTraining}>ScroG</SegButton>
            </div>
          </Field>
          <Field label="Erfahrungslevel">
            <div className="grid grid-cols-3 gap-2">
              <SegButton value="beginner" current={skill} onClick={setSkill}>Anfänger</SegButton>
              <SegButton value="advanced" current={skill} onClick={setSkill}>Fortgeschritten</SegButton>
              <SegButton value="pro" current={skill} onClick={setSkill}>Profi</SegButton>
            </div>
          </Field>
        </div>
      </section>

      {/* ── OUTPUT ── */}
      <section className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        {/* Ertrag Hero */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Geschätzter Ertrag
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {fmt(r.min)}–{fmt(r.max)}
            </span>
            <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400">g</span>
          </div>
          <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            ≈ {fmt(r.gPerW, 2)} g/W · {fmt(r.areaM2, 2)} m² Fläche
          </div>
        </div>

        {/* Kennzahlen */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Stromkosten (Zyklus)" value={`${fmt(r.cost, 2)} €`} hint="12 Wochen · 840 h" />
          <Stat label="Kosten pro Gramm" value={`${fmt(r.costPerG, 2)} €`} hint="nur Strom" />
          <Stat label="Lichtleistung" value={`${fmt(r.wPerM2)} W/m²`} accent />
          <Stat label="Pflanzen-Empfehlung" value={r.plants} hint="je nach Training" />
        </div>

        {/* Effizienz-Check */}
        <EfficiencyNote status={r.lightStatus} wPerM2={r.wPerM2} />
      </section>
    </div>
  );
}

// ── Effizienz-Hinweis ───────────────────────────────────────
function EfficiencyNote({
  status,
  wPerM2,
}: {
  status: 'low' | 'ok' | 'high';
  wPerM2: number;
}) {
  const config = {
    low: {
      cls: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: '⚠️',
      title: 'Lichtleistung zu gering',
      text: `Mit ${fmt(wPerM2)} W/m² liegst du unter 250 W/m². Erwäge mehr Watt oder ein kleineres Zelt für dichtere Blüten.`,
    },
    high: {
      cls: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: '⚠️',
      title: 'Lichtleistung sehr hoch',
      text: `Mit ${fmt(wPerM2)} W/m² liegst du über 450 W/m². Achte auf Hitze, Lichtstress und ausreichend CO₂ – sonst sinkt die Effizienz.`,
    },
    ok: {
      cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      icon: '✅',
      title: 'Optimale Lichtleistung',
      text: `${fmt(wPerM2)} W/m² liegen im empfohlenen Bereich (250–450 W/m²). Gute Basis für hohe Erträge.`,
    },
  }[status];

  return (
    <div className={`rounded-xl border p-4 ${config.cls}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span>{config.icon}</span>
        {config.title}
      </div>
      <p className="mt-1 text-xs leading-relaxed opacity-90">{config.text}</p>
    </div>
  );
}