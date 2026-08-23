import { Reveal, Stagger, StaggerItem } from '../components/primitives/index.js'

const UDAJE = [
  { label: 'Sídlo', hodnota: 'Borová 3295/36, 010 01 Žilina, Slovensko' },
  { label: 'Založené', hodnota: '2012' },
  { label: 'Odbor', hodnota: 'Dopravné stavby a bezpečnostné prvky komunikácií' },
  {
    label: 'Predpisy',
    hodnota:
      'vyhláška MŽP SR č. 532/2002 Z. z. a vyhláška MV SR č. 9/2009 Z. z.',
  },
]

export default function ONas() {
  return (
    <section
      id="o-nas"
      className="bg-[var(--color-surface)] py-[var(--section-padding-y)]"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                O nás
              </p>
              <h2 className="mt-5 max-w-[18ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {'Dopravné stavby od roku 2012'}
              </h2>
              <p className="mt-7 max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {
                  'Firma Cestné prvky s.r.o. bola založená v roku 2012. V oblasti dopravných stavieb používame vlastné technológie a spolupracujeme s významnými európskymi spoločnosťami z tejto oblasti. Pracujeme pre mestá, župy, správcov ciest a stavebné firmy.'
                }
              </p>
            </Reveal>

            <Stagger staggerChildren={0.06} className="mt-10">
              {UDAJE.map((udaj) => (
                <StaggerItem key={udaj.label}>
                  <div className="grid grid-cols-1 gap-1 border-t border-[var(--color-border)] py-5 sm:grid-cols-12 sm:gap-6">
                    <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)] sm:col-span-4">
                      {udaj.label}
                    </span>
                    <span className="max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text)] sm:col-span-8">
                      {udaj.hodnota}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal className="lg:col-span-5">
            <img
              src={`${import.meta.env.BASE_URL}assets/32-33367602_1897316533626452_7756924709983223808_n.jpg`}
              width={1200}
              height={900}
              alt="Realizácia debarierizačných prvkov na chodníku"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
            <p className="mt-4 max-w-[40ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
              {'Vlastná realizácia · Kaltplastik a nerezové indikátory'}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
