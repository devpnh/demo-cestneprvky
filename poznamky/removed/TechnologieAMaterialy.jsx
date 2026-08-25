import { Reveal, Stagger, StaggerItem, Parallax } from '../components/primitives/index.js'

const TABULKA = [
  { parameter: 'Odporúčaná rýchlosť', kt50: '< 30 km / h', kt35: '> 30 km / h' },
  { parameter: 'Rozmery (Ø / H)', kt50: '300/ca.60', kt35: '300/ca.35' },
  { parameter: 'Hmotnosť', kt50: '2,5 kg', kt35: '2,0 kg' },
]

const VYHODY = [
  'Nízke investičné náklady',
  'Dlhá životnosť, plne recyklovateľné',
  'Jednoduchá inštalácia',
  'Jednoduché odstránenie a opakované použitie',
]

export default function TechnologieAMaterialy() {
  return (
    <section
      id="technologie"
      className="bg-[var(--color-surface)] py-[var(--section-padding-y)]"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <Reveal>
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Technológie a materiály
          </p>
          <h2 className="mt-5 max-w-[22ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
            Parametre, ktoré si viete overiť v zadaní
          </h2>
        </Reveal>

        <Reveal className="mt-12 lg:mt-14">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            <div className="border-t border-[var(--color-text)] pt-4">
              <dt className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                {'Pevnosť lepeného obrubníka po 30 minútach'}
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-mono)] text-[length:var(--text-3xl)] tabular-nums text-[var(--color-text)]">
                {'100 %'}
              </dd>
            </div>
            <div className="border-t border-[var(--color-text)] pt-4">
              <dt className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                {'Výšky retardérov DEBUZ® Kölner Teller'}
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-mono)] text-[length:var(--text-3xl)] tabular-nums text-[var(--color-text)]">
                {'35 / 50 mm'}
              </dd>
            </div>
            <div className="border-t border-[var(--color-text)] pt-4">
              <dt className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                {'Rozpúšťadlá v materiáli ColdPlastic'}
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-mono)] text-[length:var(--text-3xl)] tabular-nums text-[var(--color-text)]">
                {'Žiadne'}
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="aspect-[16/9] w-full overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
              <Parallax speed={0.12} className="h-full w-full">
                <img
                  src={`${import.meta.env.BASE_URL}assets/14-PD-1.jpg`}
                  width={1440}
                  height={800}
                  alt="Vodorovné dopravné značenie priechodu pre chodcov realizované studeným plastom"
                  loading="lazy"
                  className="h-full w-full scale-110 object-cover"
                />
              </Parallax>
            </div>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {'Vlastná realizácia · vodorovné dopravné značenie'}
            </p>
            <h3 className="mt-6 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
              {'Studený plast ColdPlastik'}
            </h3>
            <p className="mt-3 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {
                'Studený plast odoberáme od popredných svetových výrobcov, ktorí garantujú najvyššiu akosť materiálu. Neobsahuje žiadne rozpúšťadlá, je extrémne odolný voči poveternostným vplyvom aj mechanickému poškodeniu pri vysokom zaťažení dopravnou premávkou a použiteľný na všetkých pochôdznych povrchoch: jazdné pruhy, cyklistické chodníky, priechody pre chodcov, priemyselné a skladovacie zóny, letiská, parkovacie miesta aj podzemné garáže.'
              }
            </p>
          </Reveal>

          <Reveal className="lg:col-span-6">
            <div className="aspect-[16/9] w-full overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
              <Parallax speed={0.12} className="h-full w-full">
                <img
                  src={`${import.meta.env.BASE_URL}assets/13-Medeny_Hamor_1-scaled.jpg`}
                  width={1440}
                  height={800}
                  alt="Lepené cestné obrubníky osadené na komunikácii, Medený Hámor"
                  loading="lazy"
                  className="h-full w-full scale-110 object-cover"
                />
              </Parallax>
            </div>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {'Vlastná realizácia · lepené obrubníky · Medený Hámor'}
            </p>
            <h3 className="mt-6 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
              {'Lepené obrubníky s pevnosťou po 30 min.'}
            </h3>
            <p className="mt-3 max-w-[58ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {
                'Nízke obrubníky lepíme k podkladu tmelom na báze akrylovej živice. Odpadá veľké množstvo búracích prác aj ťažké mechanizmy a po nalepení na stanovené miesto nadobúdajú už po 30 min. 100 % svojej pevnosti, takže sa dá pokračovať v ďalších stavebných prácach. Tým sa minimalizujú dopravné obmedzenia na funkčných komunikáciách aj náklady s nimi spojené. Zálievkové hmoty nie sú potrebné, lepidlo vytvorí dokonalý styk medzi obrubníkom a vozovkou.'
              }
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[var(--color-border)] pt-12 lg:mt-20 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <Reveal className="lg:col-span-7">
            <h3 className="max-w-[24ch] font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
              {'DEBUZ® – Kölner Teller: technický popis'}
            </h3>
            <p className="mt-4 max-w-[60ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {
                'Retardéry z vysokokvalitného liateho hliníka vo výške 35 a 50mm. Usporiadanie osadených tanierov núti vodiča zachovať určitú rýchlosť, preto sa používajú pri školách, škôlkach a na priechodoch pre chodcov v areáloch.'
              }
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-0 border-collapse text-left sm:min-w-[30rem]">
                <caption className="sr-only">
                  {'Technický popis DEBUZ® – Kölner Teller'}
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-text)]">
                    <th
                      scope="col"
                      className="py-3 pr-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]"
                    >
                      Parameter
                    </th>
                    <th
                      scope="col"
                      className="py-3 pr-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] font-medium uppercase tracking-[0.08em] text-[var(--color-text)]"
                    >
                      {'Typ KT – 50'}
                    </th>
                    <th
                      scope="col"
                      className="py-3 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] font-medium uppercase tracking-[0.08em] text-[var(--color-text)]"
                    >
                      {'Typ KT – 35'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TABULKA.map((riadok) => (
                    <tr
                      key={riadok.parameter}
                      className="border-b border-[var(--color-border)]"
                    >
                      <th
                        scope="row"
                        className="py-4 pr-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-muted)]"
                      >
                        {riadok.parameter}
                      </th>
                      <td className="py-4 pr-4 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium tabular-nums whitespace-nowrap text-[var(--color-text)]">
                        {riadok.kt50}
                      </td>
                      <td className="py-4 font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium tabular-nums whitespace-nowrap text-[var(--color-text)]">
                        {riadok.kt35}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 max-w-[60ch] font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase leading-[var(--leading-normal)] tracking-[0.08em] text-[var(--color-muted)]">
              {
                'Typ KT – 35 s možnosťou použitia pre autobusové pruhy · inštalácia v dvojrade s rozostupom 500 mm'
              }
            </p>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal>
              <img
                src={`${import.meta.env.BASE_URL}assets/03-MT_1-600x390.jpg`}
                width={600}
                height={390}
                alt="Osadené retardéry na upokojovanie dopravy na vozovke"
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
            </Reveal>

            <Stagger staggerChildren={0.06} className="mt-8">
              {VYHODY.map((vyhoda) => (
                <StaggerItem key={vyhoda}>
                  <p className="border-t border-[var(--color-border)] py-4 font-[family-name:var(--font-body)] text-[length:var(--text-base)] text-[var(--color-text)]">
                    {vyhoda}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal>
              <p className="max-w-[46ch] border-t border-[var(--color-border)] pt-4 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
                {
                  'Priľnavosť na všetkých typoch asfaltových a betónových vozoviek zabezpečuje DEBUZ® dvojzložkové lepidlo, takže nedochádza k poškodeniu povrchu vozovky.'
                }
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
