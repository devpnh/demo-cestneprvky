import { Reveal } from '../../components/primitives/index.js'
import { MonoStitok } from '../../components/kit/index.js'
import { sadzba } from '../../lib/sadzba.js'

/**
 * Hlavička pásma na `/o-firme` — **jedna mriežka pre celú stránku**.
 *
 * ## Prečo nie zdieľaná `SekciaHlavicka`
 *
 * Peter (28. 8. 2026): „ten alignment toho textu ma zabíja na niektorých
 * miestach“. Zmerané na hotovej stránke (ľavé hrany textových blokov na
 * 1440 px) to bolo doslova toto:
 *
 *     136 · 176 · 438 · 536 · 547 · 677 · 740 · 752 · 855 · 936 · 1042
 *
 * Jedenásť zvislých osí na jednej stránke, pretože každé pásmo si delilo
 * dvanásťstĺpcovú mriežku inak: hlavička sekcie 7/5 (perex na 855),
 * tvrdenia 5/7 s odrážkou (677), vyhlášky a aktuality 4/8 (547), značky
 * 6/6 (752). Väčšina z tých osí je od seba 100 px — teda dosť na to, aby
 * oko videlo, že to nesedí, a málo na to, aby to vyzeralo zámerne.
 *
 * Preto má stránka **jediné delenie: polovica a polovica.** Ľavá polovica
 * začína na 136, pravá na 752 a nič iné na stránke neexistuje (okrem
 * mriežok rovnakých buniek — triptych a technický list — ktoré oko číta
 * ako jeden objekt).
 *
 * ## Druhý rozdiel: zarovnanie na vrch
 *
 * `SekciaHlavicka` sadzí perex na SPODNÚ hranu nadpisu (`items-end`), takže
 * pri trojriadkovom titule text vpravo začína o pol nadpisu vyššie a visí
 * vo vzduchu. Tu sú stĺpce zarovnané na vrch: obe polovice začínajú na tej
 * istej linke a je vidieť, že patria k sebe.
 *
 * Zvyšok webu ostáva na `SekciaHlavicka` — toto je odchýlka jednej stránky,
 * nie nový štandard. Do kitu sa presunie, až keď na ňu prejdú aj ostatné
 * podstránky.
 */
export default function HlavickaPasma({
  stitok,
  nadpis,
  text = null,
  aside = null,
  tmava = false,
  sirkaNadpisu = 'max-w-[16ch]',
  akcia = null,
  className = '',
}) {
  return (
    <div className={`grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2 ${className}`}>
      <Reveal>
        {stitok ? <MonoStitok tmava={tmava}>{stitok}</MonoStitok> : null}
        <h2
          className={`mt-5 text-balance font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] ${sirkaNadpisu} ${
            tmava ? 'text-[var(--color-bg)]' : 'text-[var(--color-text)]'
          }`}
        >
          {sadzba(nadpis)}
        </h2>
        {akcia ? <div className="mt-8">{akcia}</div> : null}
      </Reveal>

      {text || aside ? (
        <Reveal oneskorenie={120}>
          {/* Odsadenie zhora je optické: telový text má 18 px a nadpis 52 px,
              takže pri rovnakom `top` sedí telo o kúsok vyššie než účiaria
              prvého riadku nadpisu. `lg:pt-[0.9rem]` obe linky zrovná. */}
          <div className="lg:pt-[0.9rem]">
            {text ? (
              <p
                className={`max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] ${
                  tmava ? 'text-[var(--color-bg)] opacity-80' : 'text-[var(--color-muted)]'
                }`}
              >
                {sadzba(text)}
              </p>
            ) : null}
            {aside}
          </div>
        </Reveal>
      ) : null}
    </div>
  )
}
