import { Reveal } from '../primitives/index.js'
import MonoStitok from './MonoStitok.jsx'

/**
 * Hlavička sekcie: vľavo mikro-štítok a nadpis, vpravo perex zarovnaný na
 * spodnú hranu nadpisu. Dvojstĺpcová verzia je odpoveď na starý nález
 * „perex visí vo vzduchu vedľa H2“ — perex má vlastný stĺpec dorazený na
 * pravý okraj kontajnera, nie voľne plávajúci text.
 */
export default function SekciaHlavicka({
  stitok,
  nadpis,
  perex,
  tmava = false,
  ako: Ako = 'h2',
  sirkaNadpisu = 'max-w-[20ch]',
  akcia = null,
  className = '',
}) {
  const jednoStlpec = !perex && !akcia
  return (
    <Reveal className={className}>
      <div className={jednoStlpec ? '' : 'grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-16'}>
        <div className={jednoStlpec ? '' : 'lg:col-span-7'}>
          {stitok ? <MonoStitok tmava={tmava}>{stitok}</MonoStitok> : null}
          <Ako
            className={`mt-5 text-balance font-[family-name:var(--font-display)] ${
              Ako === 'h1' ? 'text-[length:var(--text-5xl)]' : 'text-[length:var(--text-4xl)]'
            } font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] ${sirkaNadpisu} ${
              tmava ? 'text-[var(--color-bg)]' : 'text-[var(--color-text)]'
            }`}
          >
            {nadpis}
          </Ako>
        </div>
        {perex || akcia ? (
          <div className="lg:col-span-5 lg:ml-auto">
            {perex ? (
              <p
                className={`max-w-[52ch] font-[family-name:var(--font-body)] text-[length:var(--text-lg)] leading-[var(--leading-normal)] ${
                  tmava ? 'text-[var(--color-bg)] opacity-80' : 'text-[var(--color-muted)]'
                }`}
              >
                {perex}
              </p>
            ) : null}
            {akcia ? <div className="mt-6">{akcia}</div> : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  )
}
