import { ArrowRight } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '../components/primitives/index.js'

const SKUPINY = [
  {
    skupina: 'Debarierizácia a značenie',
    polozky: [
      {
        nazov: 'Značenie pre nevidiacich a slabozrakých',
        popis:
          'Štruktúrované značenie a piktogramy stierkovaním studeným plastom Kaltplastik, mosadzné a nerezové indikátory.',
      },
      {
        nazov: 'Vodorovné dopravné značenie',
        popis:
          'Inštalácie z materiálov ColdPlastik: priechody pre chodcov, vodiace línie, opticko-akustická brzda, piktogramy.',
      },
      {
        nazov: 'Odstránenie starého vodorovného dopravného značenia',
        popis:
          'Odstránenie prekonaného značenia pred obnovou trasy alebo zmenou organizácie dopravy.',
      },
    ],
  },
  {
    skupina: 'Konštrukčné prvky vozovky',
    polozky: [
      {
        nazov: 'Lepené obrubníky',
        popis:
          'Nízke obrubníky lepené tmelom na báze akrylovej živice, bez búracích prác a ťažkých mechanizmov.',
      },
      {
        nazov: 'Spomaľovače dopravy (retardéry)',
        popis:
          'DEBUZ® retardéry Kölner Teller z liateho hliníka na upokojovanie dopravy pri školách a priechodoch pre chodcov.',
      },
      {
        nazov: 'Cyklotrasy',
        popis:
          'Značenie a bezpečnostné prvky cyklistických chodníkov a ich napojení na komunikácie.',
      },
    ],
  },
  {
    skupina: 'Povrchy a údržba',
    polozky: [
      {
        nazov: 'Zálievkové a vysprávkové hmoty',
        popis:
          'Ošetrenie škár a lokálnych porúch krytu vozovky zálievkovými a vysprávkovými hmotami.',
      },
      {
        nazov: 'Bezpečnostný protišmykový náter',
        popis:
          'Protišmykový náter na miesta so zvýšeným rizikom šmyku, na pochôdzne aj pojazdné plochy.',
      },
      {
        nazov: 'Štítky: Braillovo písmo, gravírovanie, hmatové mapy',
        popis:
          'Orientačné štítky, gravírovanie a hmatové mapy pre osoby so zrakovým postihnutím.',
      },
    ],
  },
]

export default function Sluzby() {
  return (
    <section
      id="sluzby"
      className="bg-[var(--color-bg)] py-[var(--section-padding-y)]"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Služby
              </p>
              <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                Čo realizujeme na pozemných komunikáciách
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {
                  'Deväť prvkov v troch celkoch: debarierizácia a značenie, konštrukčné prvky vozovky, povrchy a údržba. Rozsah aj materiál prispôsobíme zadaniu objednávateľa.'
                }
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 lg:mt-20">
          {SKUPINY.map((skupina, si) => (
            <div
              key={skupina.skupina}
              className={
                si === 0
                  ? 'grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12'
                  : 'mt-12 grid grid-cols-1 gap-6 border-t border-[var(--color-border)] pt-12 lg:mt-16 lg:grid-cols-12 lg:gap-12 lg:pt-16'
              }
            >
              <div className="lg:col-span-3">
                <Reveal>
                  <h3 className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {skupina.skupina}
                  </h3>
                </Reveal>
              </div>

              <Stagger
                staggerChildren={0.06}
                className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3"
              >
                {skupina.polozky.map((polozka) => (
                  <StaggerItem key={polozka.nazov}>
                    <div className="h-full border-t border-[var(--color-text)] pt-5">
                      <p className="max-w-[26ch] font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                        {polozka.nazov}
                      </p>
                      <p className="mt-3 max-w-[38ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                        {polozka.popis}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ))}
        </div>

        <Reveal className="mt-14">
          <a
            href="#kontakt"
            className="inline-flex min-h-[44px] items-center gap-2 border-b-2 border-[var(--color-accent)] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-semibold text-[var(--color-accent)]"
          >
            Konzultovať konkrétny prvok so zadaním
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
