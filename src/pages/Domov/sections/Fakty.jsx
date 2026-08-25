import { Sekcia, PasFaktov, Lajna } from '../../../components/kit/index.js'
import { Reveal } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'

/**
 * Tenký pás overiteľných faktov medzi hero a prvým obsahovým pásmom.
 * Nie je to plnohodnotné pásmo: žiadny nadpis, malý vertikálny rytmus,
 * ukončené prerušovanou linkou, ktorá otvára sivé pásmo pod ním.
 *
 * Fakty sú doslova z `FIRMA.fakty` — rok založenia, sídlo, dve vyhlášky a
 * konzultácie ÚNSS. Žiadne počty realizácií ani roky skúseností: tie
 * v podkladoch klienta nie sú (STANDARDY A3).
 *
 * Na 390 px sa `whitespace-nowrap` položiek zámerne uvoľňuje: najdlhší fakt
 * má v mono reze 12 px cez 380 px a nezlomený by pretiahol dokument doprava
 * (D1). Od 640 px, kde sa už vojde, platí nedeliteľnosť z kitu.
 */
export default function Fakty() {
  return (
    <Sekcia id="fakty" pasmo="biela" padding="male">
      <Reveal>
        <PasFaktov fakty={FIRMA.fakty} />
      </Reveal>
      <Lajna className="mt-10" />
    </Sekcia>
  )
}
