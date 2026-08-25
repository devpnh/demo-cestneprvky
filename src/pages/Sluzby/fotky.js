import { REALIZACIE } from '../../content/realizacie.js'
import { castiPopisu } from '../Realizacie/skupiny.js'

/**
 * Popis fotky patrí ku konkrétnemu súboru, nie ku kontextu, v ktorom sa
 * zobrazí. Katalóg `REALIZACIE` je jediné miesto, kde sa popisy pri prepise
 * obsahu opravujú — `fotky` a `dlazdica` v `sluzby.js` nesú vlastné, staršie
 * znenie a rozchádzajú sa s ním pri štyroch súboroch.
 *
 * Rozhodujúci prípad: `08-BA_Bosakova-600x390.jpg` má v službe „Odstránenie
 * značenia“ stále `alt` o odstránenom značení, hoci na zábere je priechod
 * s kompletnými pásmi (katalóg to už opravil na „Priechod pre chodcov
 * s vodorovným značením“). Tvrdenie, ktoré fotka nedokladá, sa na web dostať
 * nesmie, a fotografiu úseku pred odstránením a po ňom si v `chyba` tej
 * služby pýtame. Preto platí jednoduché pravidlo: kde katalóg súbor pozná,
 * jeho `alt` vyhráva. Keď sa `sluzby.js` s katalógom zrovná, helper zmizne
 * bez ďalšej zmeny v stránkach.
 */
const ZAZNAM_PODLA_SUBORU = new Map(REALIZACIE.map((r) => [r.src, r]))

/** `alt` fotky alebo dlaždice: z katalógu realizácií, inak z dát služby. */
export const altFotky = (fotka) => ZAZNAM_PODLA_SUBORU.get(fotka.src)?.alt || fotka.alt

/**
 * Popisok fotky na stránke služby.
 *
 * Pravidlo, čo sa smie napísať pod fotku, žije na jednom mieste pre celý web —
 * v `Realizacie/skupiny.js` (`castiPopisu`). Stránky služieb mali doteraz
 * vlastné: v úvode sa vypisovalo holé `miesto`, v galérii `prvok · miesto`, a
 * keď miesto nebolo doložené, na oboch miestach stálo „Realizácia klienta“.
 * Na `/realizacie` sa pritom tá istá fotka opísala inak. Návštevník tak pri
 * rovnakej triede fotiek čítal na každej stránke niečo iné.
 *
 * Teraz platí pravidlo galérie doslova: keď miesto nevieme, miesto sa
 * nevypisuje a ničím sa nenahrádza. Zostáva prostredie, ktoré z fotky vieme,
 * a pri produktovej fotografii len jej pomenovanie. Typ prvku stojí vpredu —
 * v mriežke galérie ho nesie samostatný riadok popisku, tu sa spája
 * oddeľovačom rovnako ako vo výbere realizácií na Domove.
 *
 * Fotky služieb sú tie isté súbory ako v katalógu, takže sa polia `isteMiesto`,
 * `prostredie` a `produktovaFoto` čítajú z katalógu; dáta služby sú len
 * poistka, keby do nich pribudol súbor, ktorý katalóg nepozná.
 */
export const popisFotky = (fotka) => {
  const zaznam = ZAZNAM_PODLA_SUBORU.get(fotka.src) || fotka
  return [zaznam.prvok, ...castiPopisu(zaznam)].filter(Boolean).join(' · ')
}

/**
 * Úvodná fotka služby. Berie sa najširší dostupný záber, nie prvý v poli:
 * úvodné pásmo ju sadzí na šírku textového stĺpca a mäkká, prefúknutá fotka
 * vyzerá lacno (STANDARDY F2). Pri `protismykovy-nater` je tak v úvode záber
 * 1600 px namiesto 416 px, malý orez ide do galérie.
 */
export const uvodnaFotkaSluzby = (sluzba) =>
  (sluzba.fotky || []).reduce((najsirsia, f) => (!najsirsia || f.w > najsirsia.w ? f : najsirsia), null)

/**
 * Fotku nikdy neroztiahneme viac ako 1,4× nad jej skutočnú šírku. Podklady od
 * klienta majú od 416 do 1600 px; radšej ostane menšia, než aby predstierala
 * rozlíšenie, ktoré nemá.
 */
export const maxSirka = (f) => `${Math.round(f.w * 1.4)}px`
