import { motion, useTransform } from 'motion/react'
import { StickySection } from '../components/primitives/index.js'

const PRVKY = [
  {
    label: 'Varovný pás',
    miesto: 'Exteriér',
    src: '19-Znacenie-pre-nevidiacich-varovny-pas-a-protismykovy-nater-sc.jpg',
    width: 1439,
    height: 1079,
    alt: 'Varovný pás a protišmykový náter pred priechodom pre chodcov',
  },
  {
    label: 'Signálny pás',
    miesto: 'Exteriér',
    src: '20-BB-1-scaled.jpg',
    width: 1439,
    height: 1919,
    alt: 'Signálny pás zo štruktúrovaného značenia na chodníku',
  },
  {
    label: 'Vodiaca línia',
    miesto: 'Bratislava',
    src: '23-BA-1-scaled.jpg',
    width: 1439,
    height: 1079,
    alt: 'Vodiaca línia vedená po chodníku, Bratislava',
  },
  {
    label: 'Nerezové indikátory v exteriéri',
    miesto: 'Exteriér',
    src: '30-IMAG0678.jpg',
    width: 1200,
    height: 902,
    alt: 'Nerezové indikátory osadené v dlažbe chodníka',
  },
]

function useFaza(progress, index, total, min) {
  const start = index / total
  const end = (index + 1) / total
  const p0 = index === 0 ? start - 0.001 : start - 0.06
  const p1 = index === 0 ? start : start + 0.05
  const p2 = index === total - 1 ? end : end - 0.05
  const p3 = index === total - 1 ? end + 0.001 : end + 0.06
  return useTransform(progress, [p0, p1, p2, p3], [min, 1, 1, min])
}

function FotoVrstva({ progress, index, total, prvok }) {
  const opacity = useFaza(progress, index, total, 0)
  return (
    <motion.img
      style={{ opacity, borderRadius: 'var(--radius-sm)' }}
      src={`${import.meta.env.BASE_URL}assets/${prvok.src}`}
      width={prvok.width}
      height={prvok.height}
      alt={prvok.alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

function RiadokPrvku({ progress, index, total, prvok }) {
  const opacity = useFaza(progress, index, total, 0.32)
  return (
    <motion.li
      style={{ opacity }}
      className="flex items-baseline gap-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] text-[var(--color-bg)]"
    >
      <span
        aria-hidden="true"
        className="inline-block h-[6px] w-[6px] shrink-0 translate-y-[-2px] bg-[var(--color-accent)]"
      />
      <span>{prvok.label}</span>
    </motion.li>
  )
}

function Panel({ progress }) {
  const sirka = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <div className="flex h-full min-h-[34rem] items-center py-[var(--section-padding-y-sm)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-accent)]">
              Debarierizácia
            </p>

            <h2 className="mt-5 max-w-[22ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
              Bezbariérové prvky bez zásahu do pôvodných konštrukcií
            </h2>

            <p className="mt-7 max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-80">
              {
                'Štruktúrované vodorovné značenie a piktogramy realizujeme metódou stierkovania studeným plastom Kaltplastik na rôzne povrchy. Schéma, vzor, farebný odtieň a rozloženie prvkov prispôsobíme požiadavke objednávateľa. Druhou metódou je inštalácia odolných mosadzných a nerezových indikátorov, ktoré nevidiacich a slabozrakých informujú a varujú pred prekážkou alebo nebezpečenstvom.'
              }
            </p>

            <p
              className="mt-7 max-w-[62ch] border-l-2 border-[var(--color-accent)] pl-5 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-90"
            >
              {
                'Technológia spĺňa metodiku navrhovania debarierizačných opatrení pre osoby s obmedzenou schopnosťou pohybu a orientácie na pozemných komunikáciách v zmysle vyhlášky MŽP SR č. 532/2002 Z. z. a vyhlášky MV SR č. 9/2009 Z. z.'
              }
            </p>

            <p className="mt-7 max-w-[62ch] font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-bg)] opacity-70">
              {
                'Konzultácie k architektonickej prístupnosti, stanoviská k projektovej dokumentácii a posúdenie prvkov na mieste realizácie poskytuje '
              }
              <a
                href="https://architektonickebariery.sk/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--color-bg)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 opacity-100"
              >
                {'Únia nevidiacich a slabozrakých Slovenska'}
              </a>
              {'.'}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-accent-2)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {PRVKY.map((prvok, i) => (
                <FotoVrstva
                  key={prvok.src}
                  prvok={prvok}
                  progress={progress}
                  index={i}
                  total={PRVKY.length}
                />
              ))}
            </div>

            <div
              className="mt-5 h-[2px] w-full"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--color-bg) 22%, transparent)',
              }}
            >
              <motion.div
                style={{ width: sirka }}
                className="h-full bg-[var(--color-accent)]"
              />
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {PRVKY.map((prvok, i) => (
                <RiadokPrvku
                  key={prvok.label}
                  prvok={prvok}
                  progress={progress}
                  index={i}
                  total={PRVKY.length}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Debarierizacia() {
  return (
    <section id="debarierizacia" className="bg-[var(--color-surface-2)]">
      <StickySection
        heightVh={220}
        className="bg-[var(--color-surface-2)]"
        render={(scrollYProgress) => <Panel progress={scrollYProgress} />}
      />
    </section>
  )
}
