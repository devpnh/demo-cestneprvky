import { useState } from 'react'
import { Reveal, Stagger, StaggerItem } from '../components/primitives/index.js'

/** Naraz viditeľné realizácie; zvyšok odkryje tlačidlo (fotky sa dovtedy nenačítavajú). */
const VIDITELNYCH = 6

const REALIZACIE = [
  {
    src: '12-ZubaC48Dka-scaled.jpg',
    width: 1440,
    height: 800,
    typ: 'Značenie pre nevidiacich a slabozrakých',
    miesto: 'Zubačka',
    alt: 'Značenie pre nevidiacich a slabozrakých na priechode pre chodcov, Zubačka',
  },
  {
    src: '01-Medeny_Hamor_1-600x390.jpg',
    width: 600,
    height: 390,
    typ: 'Lepené obrubníky',
    miesto: 'Medený Hámor',
    alt: 'Lepené cestné obrubníky na rekonštruovanej komunikácii, Medený Hámor',
  },
  {
    src: '27-Tornala.jpg',
    width: 600,
    height: 450,
    typ: 'Značenie pre nevidiacich a slabozrakých',
    miesto: 'Tornaľa',
    alt: 'Varovný a signálny pás na chodníku, Tornaľa',
  },
  {
    src: '05-Protismykove-pasy-Filakovo3-416x390.jpg',
    width: 416,
    height: 390,
    typ: 'Bezpečnostný protišmykový náter',
    miesto: 'Fiľakovo',
    alt: 'Protišmykové pásy na vozovke, Fiľakovo',
  },
  {
    src: '08-BA_Bosakova-600x390.jpg',
    width: 600,
    height: 390,
    typ: 'Odstránenie starého vodorovného dopravného značenia',
    miesto: 'Bratislava Bosákova',
    alt: 'Odstránenie starého vodorovného dopravného značenia, Bratislava Bosákova',
  },
  {
    src: '25-BA_nivy_hbreavis-scaled.jpg',
    width: 600,
    height: 800,
    typ: 'Vodiaca línia',
    miesto: 'Bratislava Nivy',
    alt: 'Vodiaca línia z indikátorov na dlažbe, Bratislava Nivy',
  },
  {
    src: '06-IMG_1565-480x390.jpg',
    width: 480,
    height: 390,
    typ: 'Cyklotrasy',
    miesto: '[DOPLNIŤ]',
    alt: 'Značenie cyklotrasy na spevnenom povrchu',
  },
  {
    src: '07-Braill-600x390.jpg',
    width: 600,
    height: 390,
    typ: 'Štítky: Braillovo písmo, gravírovanie, hmatové mapy',
    miesto: 'Produktová fotografia',
    alt: 'Orientačný štítok s Braillovým písmom',
  },
  {
    src: '04-zalievkove_hmoty_01-600x390.jpg',
    width: 600,
    height: 390,
    typ: 'Zálievkové a vysprávkové hmoty',
    miesto: '[DOPLNIŤ]',
    alt: 'Zálievka škáry v kryte vozovky',
  },
]

export default function Realizacie() {
  const [vsetky, setVsetky] = useState(false)
  const zobrazene = vsetky ? REALIZACIE : REALIZACIE.slice(0, VIDITELNYCH)
  return (
    <section
      id="realizacie"
      className="bg-[var(--color-bg)] py-[var(--section-padding-y)]"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Realizácie
              </p>
              <h2 className="mt-5 max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                Osadené prvky na konkrétnych miestach
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {
                  'Fotografie sú z vlastných realizácií. Ku každej uvádzame typ prvku a miesto, aby sa dala porovnať s vaším zadaním.'
                }
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger
          staggerChildren={0.06}
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {zobrazene.map((polozka) => (
            <StaggerItem key={polozka.src}>
              <figure>
                <img
                  src={`${import.meta.env.BASE_URL}assets/${polozka.src}`}
                  width={polozka.width}
                  height={polozka.height}
                  alt={polozka.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-[var(--color-surface)] object-cover"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
                <figcaption className="mt-4 border-t border-[var(--color-border)] pt-4">
                  <span className="block max-w-[30ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium leading-[var(--leading-normal)] text-[var(--color-text)]">
                    {polozka.typ}
                  </span>
                  {polozka.miesto && (
                    <span className="mt-1 block font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      {polozka.miesto}
                    </span>
                  )}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        {!vsetky && REALIZACIE.length > VIDITELNYCH && (
          <Reveal className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVsetky(true)}
              className="inline-flex min-h-[52px] items-center gap-3 border border-[var(--color-text)] px-7 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {`Zobraziť všetky realizácie (${REALIZACIE.length})`}
            </button>
          </Reveal>
        )}
      </div>
    </section>
  )
}
