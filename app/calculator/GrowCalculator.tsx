'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type PlantType = 'photo' | 'auto';
type Dominance = 'indica' | 'sativa' | 'hybrid';
type Training = 'none' | 'lst' | 'topping' | 'scrog';
type Skill = 'beginner' | 'advanced' | 'pro';
type LightStatus = 'low' | 'ok' | 'high';

const BASELINE: Record<PlantType, number> = {
  photo: 1.2,
  auto: 0.95,
};

const GENETIC: Record<Dominance, number> = {
  indica: 1.0,
  sativa: 0.9,
  hybrid: 1.05,
};

const TRAINING: Record<Training, number> = {
  none: 0.85,
  lst: 1.0,
  topping: 1.15,
  scrog: 1.25,
};

const SKILL: Record<Skill, number> = {
  beginner: 0.7,
  advanced: 1.0,
  pro: 1.25,
};

const TOTAL_HOURS = 840;

function fmt(value: number, digits = 0) {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function recommendPlants(areaM2: number, training: Training) {
  if (areaM2 <= 0) return '–';

  const density: Record<Training, number> = {
    none: 9,
    lst: 6,
    topping: 4,
    scrog: 2,
  };

  const raw = areaM2 * density[training];
  const min = Math.max(1, Math.floor(raw * 0.75));
  const max = Math.max(min, Math.round(raw));

  return min === max ? `${min}` : `${min}–${max}`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClassName =
  'w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors';

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'px-3 py-2 rounded-lg text-sm font-medium border transition-colors ' +
        (active
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400')
      }
    >
      {children}
    </button>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent = false,
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
          (accent
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-neutral-900 dark:text-white')
        }
      >
        {value}
      </div>

      {hint && (
        <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          {hint}
        </div>
      )}
    </div>
  );
}

function EfficiencyNote({
  status,
  wPerM2,
}: {
  status: LightStatus;
  wPerM2: number;
}) {
  const config = {
    low: {
      className:
        'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: '⚠️',
      title: 'Lichtleistung zu gering',
      text: `Mit ${fmt(wPerM2)} W/m² liegst du unter 250 W/m². Erwäge mehr Lichtleistung oder eine kleinere Fläche.`,
    },
    ok: {
      className:
        'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      icon: '✅',
      title: 'Gute Lichtleistung',
      text: `${fmt(wPerM2)} W/m² liegen im empfohlenen Bereich von 250–450 W/m².`,
    },
    high: {
      className:
        'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: '⚠️',
      title: 'Lichtleistung sehr hoch',
      text: `Mit ${fmt(wPerM2)} W/m² liegst du über 450 W/m². Achte auf Hitze und Lichtstress.`,
    },
  }[status];

  return (
    <div className={`rounded-xl border p-4 ${config.className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span>{config.icon}</span>
        <span>{config.title}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed opacity-90">
        {config.text}
      </p>
    </div>
  );
}

export default function GrowCalculator() {
  const [width, setWidth] = useState(80);
  const [depth, setDepth] = useState(80);
  const [watt, setWatt] = useState(240);
  const [price, setPrice] = useState(0.35);

  const [type, setType] = useState<PlantType>('photo');
  const [dominance, setDominance] = useState<Dominance>('hybrid');
  const [training, setTraining] = useState<Training>('lst');
  const [skill, setSkill] = useState<Skill>('advanced');

  const result = useMemo(() => {
    const areaM2 = (width * depth) / 10_000;

    const estimatedYield =
      watt *
      BASELINE[type] *
      GENETIC[dominance] *
      TRAINING[training] *
      SKILL[skill];

    const minYield = estimatedYield * 0.9;
    const maxYield = estimatedYield * 1.1;

    const gPerW = watt > 0 ? estimatedYield / watt : 0;

    const electricityCost = ((watt * TOTAL_HOURS) / 1000) * price;
    const costPerGram =
      estimatedYield > 0 ? electricityCost / estimatedYield : 0;

    const wPerM2 = areaM2 > 0 ? watt / areaM2 : 0;

    let lightStatus: LightStatus = 'ok';

    if (wPerM2 < 250) {
      lightStatus = 'low';
    }

    if (wPerM2 > 450) {
      lightStatus = 'high';
    }

    return {
      areaM2,
      estimatedYield,
      minYield,
      maxYield,
      gPerW,
      electricityCost,
      costPerGram,
      wPerM2,
      lightStatus,
      plants: recommendPlants(areaM2, training),
    };
  }, [width, depth, watt, price, type, dominance, training, skill]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Links: Inputs */}
      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Setup
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Zeltbreite (cm)">
              <input
                type="number"
                min={20}
                value={width}
                onChange={(event) => setWidth(Number(event.target.value))}
                className={inputClassName}
              />
            </Field>

            <Field label="Zelttiefe (cm)">
              <input
                type="number"
                min={20}
                value={depth}
                onChange={(event) => setDepth(Number(event.target.value))}
                className={inputClassName}
              />
            </Field>

            <Field label="LED-Leistung (Watt)">
              <input
                type="number"
                min={0}
                value={watt}
                onChange={(event) => setWatt(Number(event.target.value))}
                className={inputClassName}
              />
            </Field>

            <Field label="Strompreis (€/kWh)">
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
                className={inputClassName}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Genetik
          </h2>

          <Field label="Typ">
            <div className="grid grid-cols-2 gap-2">
              <OptionButton
                active={type === 'photo'}
                onClick={() => setType('photo')}
              >
                Photoperiodisch
              </OptionButton>

              <OptionButton
                active={type === 'auto'}
                onClick={() => setType('auto')}
              >
                Autoflower
              </OptionButton>
            </div>
          </Field>

          <Field label="Dominanz">
            <div className="grid grid-cols-3 gap-2">
              <OptionButton
                active={dominance === 'indica'}
                onClick={() => setDominance('indica')}
              >
                Indica
              </OptionButton>

              <OptionButton
                active={dominance === 'sativa'}
                onClick={() => setDominance('sativa')}
              >
                Sativa
              </OptionButton>

              <OptionButton
                active={dominance === 'hybrid'}
                onClick={() => setDominance('hybrid')}
              >
                Hybrid
              </OptionButton>
            </div>
          </Field>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Technik &amp; Erfahrung
          </h2>

          <Field label="Pflanzentraining">
            <div className="grid grid-cols-2 gap-2">
              <OptionButton
                active={training === 'none'}
                onClick={() => setTraining('none')}
              >
                Keine
              </OptionButton>

              <OptionButton
                active={training === 'lst'}
                onClick={() => setTraining('lst')}
              >
                LST
              </OptionButton>

              <OptionButton
                active={training === 'topping'}
                onClick={() => setTraining('topping')}
              >
                Topping / FIM
              </OptionButton>

              <OptionButton
                active={training === 'scrog'}
                onClick={() => setTraining('scrog')}
              >
                ScroG
              </OptionButton>
            </div>
          </Field>

          <Field label="Erfahrungslevel">
            <div className="grid grid-cols-3 gap-2">
              <OptionButton
                active={skill === 'beginner'}
                onClick={() => setSkill('beginner')}
              >
                Anfänger
              </OptionButton>

              <OptionButton
                active={skill === 'advanced'}
                onClick={() => setSkill('advanced')}
              >
                Fortgeschritten
              </OptionButton>

              <OptionButton
                active={skill === 'pro'}
                onClick={() => setSkill('pro')}
              >
                Profi
              </OptionButton>
            </div>
          </Field>
        </div>
      </section>

      {/* Rechts: Output */}
      <section className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Geschätzter Ertrag
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {fmt(result.minYield)}–{fmt(result.maxYield)}
            </span>
            <span className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
              g
            </span>
          </div>

          <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Ø {fmt(result.estimatedYield)} g · {fmt(result.gPerW, 2)} g/W ·{' '}
            {fmt(result.areaM2, 2)} m² Fläche
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Stromkosten"
            value={`${fmt(result.electricityCost, 2)} €`}
            hint="12 Wochen · 840 h"
          />

          <StatCard
            label="Kosten pro Gramm"
            value={`${fmt(result.costPerGram, 2)} €`}
            hint="nur Stromkosten"
          />

          <StatCard
            label="Lichtleistung"
            value={`${fmt(result.wPerM2)} W/m²`}
            hint="Watt pro Quadratmeter"
            accent
          />

          <StatCard
            label="Pflanzen"
            value={result.plants}
            hint="Empfehlung"
          />
        </div>

        <EfficiencyNote
          status={result.lightStatus}
          wPerM2={result.wPerM2}
        />
      </section>
    </div>
  );
}