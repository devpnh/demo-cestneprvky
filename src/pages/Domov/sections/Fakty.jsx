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
 * Lámanie riadkov tu neriešime žiadnou triedou: `PasFaktov` z kitu lepí
 * oddeľovač „·“ k poslednému slovu nezlomiteľnou medzerou, takže oddeľovač
 * neprepadne sám na riadok a zároveň sa najdlhší fakt (v mono reze 12 px cez
 * 380 px) na 390 px normálne zlomí a neťahá `scrollWidth` dokumentu (D1).
 * Vlastný `whitespace-nowrap` by túto opravu zrušil — nepridávať.
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
