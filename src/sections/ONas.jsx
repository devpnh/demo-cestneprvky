import { Reveal } from '../components/primitives/index.js'


export default function ONas() {
  return (
    <section
      id="o-nas"
      className="bg-[var(--color-surface)] py-[var(--section-padding-y)]"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                O nás
              </p>
              <h2 className="mt-5 max-w-[18ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {'Dopravné stavby od roku 2012'}
              </h2>
            </Reveal>

            <Reveal className="mt-9">
              <p className="max-w-[26ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-medium leading-[1.35] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                {'V oblasti dopravných stavieb používame vlastné technológie a spolupracujeme s významnými európskymi spoločnosťami.'}
              </p>
              <p className="mt-6 max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {'Firma Cestné prvky s.r.o. zo Žiliny pracuje pre mestá, župy, správcov ciest a stavebné firmy.'}
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5">
            <img
              src={`${import.meta.env.BASE_URL}assets/26-TN_1-scaled.jpg`}
              width={1050}
              height={1400}
              alt="Červené štruktúrované značenie pre nevidiacich na chodníku"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
            <p className="mt-4 max-w-[40ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
              {'Vlastná realizácia · značenie pre nevidiacich'}
            </p>
          </Reveal>
        </div>

      </div>
    </section>
  )
}
