import { PasKariet, Sekcia, Tlacidlo } from '../../../components/kit/index.js'
import { Reveal } from '../../../components/primitives/index.js'
import { FIRMA } from '../../../content/firma.js'
import HlavickaPasma from '../HlavickaPasma.jsx'
import FotkaVyter from '../FotkaVyter.jsx'
import { TECHNOLOGIE, popisZaberu } from '../fotky.js'

/**
 * Technológie — tmavé pásmo v strede stránky. Odpovedá na otázku **ako**.
 *
 * ## Triptych, nie zoznam a nie stoh
 *
 * Tri postupy boli doteraz odrážkami vnútri odseku o firme: štyri riadky
 * textu, ktoré sa nedali odlíšiť od zvyšku pásma. Pritom ku každému z nich
 * máme doložený záber — presne ten, na ktorom je postup vidieť.
 *
 * Sú preto vysadené ako triptych: tri fotografie na výšku vedľa seba, meno
 * postupu pod každou. Je to najjednoduchšia možná skladba pre tri rovnocenné
 * veci a práve preto správna — nič sa nestrieda, nič sa neschováva, oko
 * vezme všetky tri naraz.
 *
 * **Stoh kariet, ktorý tie isté tri technológie nesie na Domove
 * (`Domov/sections/Technologie.jsx`), sa sem zámerne nekopíruje.** Ten istý
 * pohyb na dvoch stránkach za sebou prestáva byť podpisom a stáva sa
 * manierou; navyše je to jediný sticky-scrub webu a ten smie byť jeden
 * (STANDARDY E1).
 *
 * ## Pohyb
 *
 * Fotky sa odkrývajú výterom zdola s odstupom 0 / 110 / 220 ms, takže sa
 * triptych „nastrieka“ zľava doprava, a každá má vlastnú rýchlosť paralaxy —
 * stĺpce sa pri scrolle nehýbu ako jedna doska. Nič viac; text stojí.
 */

/* Štvorec, nie výška na výšku. Dva z troch záberov sú vysoké originály
   (721×1600 a 960×1280) a znesú akýkoľvek orez, tretí (osadené retardéry) má
   600×390 — pri portrétovom ráme by sa z neho bral pruh 292 px široký
   a roztiahol na 380 px, teda mäkká fotka predstierajúca rozlíšenie, ktoré
   nemá (STANDARDY F2). Vo štvorci si berie 390 px a ostáva ostrý.

   Odstup výterov a rýchlosť paralaxy na stĺpec. Rýchlosti sú zámerne
   nesúmerné (0,10 / 0,18 / 0,13): pri rovnakých hodnotách sa tri rámy
   posúvajú unisono a paralax nie je vidieť, len cítiť ako trhanie. */
const ODSTUP = 110
const RYCHLOSTI = [0.1, 0.18, 0.13]

export default function Technologie() {
  return (
    <Sekcia id="technologie" pasmo="tmava">
      <HlavickaPasma
        tmava
        stitok="Technológie"
        nadpis="Čím pracujeme"
        text={FIRMA.technologie.uvod}
        sirkaNadpisu="max-w-[12ch]"
      />

      <PasKariet
        triedaMriezky="sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3"
        className="mt-14 lg:mt-20"
      >
        {TECHNOLOGIE.map((t, i) => (
          /* `flex h-full flex-col` + `mt-auto` na popisku: mená postupov majú
             dva aj tri riadky a bez toho by mono riadky pod nimi stáli
             v troch rôznych výškach. Takto sedia na jednej účiarie. */
          <div key={t.nazov} className="flex h-full w-[78vw] shrink-0 snap-start flex-col sm:w-auto sm:shrink">
            <FotkaVyter
              src={t.foto.src}
              w={t.foto.w}
              h={t.foto.h}
              alt={t.foto.alt}
              pomer="1/1"
              oneskorenie={i * ODSTUP}
              rychlost={RYCHLOSTI[i] ?? 0.12}
              tmava
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
            {/* Meno postupu pod fotkou, oddelené vlasovou linkou v jase
                pásma. Popisok fotky (prvok · prostredie) je pod ním v mono,
                aby bolo jasné, že fotka postup dokladá, a nie ilustruje. */}
            <div className="mt-6 flex flex-1 flex-col border-t border-[rgba(255,255,255,0.18)] pt-5">
              <h3 className="max-w-[20ch] text-balance font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-medium leading-[1.25] tracking-[var(--tracking-tight)] text-[var(--color-bg)]">
                {t.nazov}
              </h3>
              <p className="mt-auto pt-4 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
                {popisZaberu(t.foto)}
              </p>
            </div>
          </div>
        ))}
      </PasKariet>

      <Reveal className="mt-16 lg:mt-20">
        <Tlacidlo variant="tichy" tmava to="/realizacie">
          Pozrieť realizácie
        </Tlacidlo>
      </Reveal>
    </Sekcia>
  )
}
