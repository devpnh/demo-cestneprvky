import { REALIZACIE } from '../../content/realizacie.js'

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
const ALT_PODLA_SUBORU = new Map(REALIZACIE.map((r) => [r.src, r.alt]))

/** `alt` fotky alebo dlaždice: z katalógu realizácií, inak z dát služby. */
export const altFotky = (fotka) => ALT_PODLA_SUBORU.get(fotka.src) || fotka.alt

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
