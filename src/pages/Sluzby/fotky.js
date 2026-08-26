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

/**
 * Sadzba v `src/content/*` vkladá do textov nezlomiteľné medzery, takže
 * titulok zoznamu vyzerá inak v dátach a inak v zdrojáku tohto súboru.
 * Kľúč preto normalizujeme späť na obyčajnú medzeru.
 */
const kluc = (text) => (text || '').replace(/\u00A0/g, ' ')

/**
 * Fotografia, ktorá dokladá konkrétny zoznam podkategórií v sekcii
 * „Čo služba zahŕňa“.
 *
 * Priradenie je doslovné a overiteľné: súbor musí v katalógu `REALIZACIE`
 * patriť tej istej službe (`sluzba`) a jeho `prvok` musí byť položkou toho
 * zoznamu. Preto tu nie sú všetky zoznamy — pri „Jednozložkovom nátere“,
 * „Čo lepíme“ a „Kam ich osádzame“ podklady klienta záber tých prvkov
 * neobsahujú a `chyba` v `sluzby.js` si ho od neho pýta. Prázdne miesto sa
 * nevypĺňa nesúvisiacim záberom.
 */
const FOTKA_ZOZNAMU = {
  'znacenie-pre-nevidiacich': {
    // Zoznam Exteriér má prvé dve položky „Varovný pás“ a „Vodiaca línia“;
    // tento záber nesie oba naraz (`prvok: 'Vodiaca línia'`, exteriér).
    Exteriér: '24-44495307_320444702084823_8875250875791048704_n-2048x1536.jpg',
    // Zoznam Interiér má len „Varovný pás“ a „Vodiacu líniu“. Táto fotka je
    // jediná dvojica vodiacich línií s `prostredie: 'Interiér'`.
    Interiér: '37-BA_nivy_2-1-scaled.jpg',
  },
  'vodorovne-dopravne-znacenie': {
    // Položka „Vodiaca línia v priechode pre chodcov“ zo zoznamu ColdPlastic;
    // katalóg má fotku pod tým istým `prvok` a pri tejto službe.
    'Studený plast ColdPlastic': '31-Vodiaca-linia-v-priechode-BA.jpg',
  },
}

/** Fotka k zoznamu podkategórií, alebo `null`, keď ju podklady nemajú. */
export const fotkaZoznamu = (slug, titulok) =>
  ZAZNAM_PODLA_SUBORU.get(FOTKA_ZOZNAMU[slug]?.[kluc(titulok)]) || null

/**
 * Fotografia k bloku konzultácií (Únia nevidiacich a slabozrakých Slovenska).
 *
 * Blok hovorí o konzultáciách k debarierizačným prvkom v exteriéri aj
 * interiéri, takže vedľa neho smie stáť len samotný debarierizačný prvok.
 * Signálny pás a vodiaca línia v priechode pre chodcov je presne ten prípad,
 * ku ktorému sa stanovisko vydáva.
 */
const FOTKA_KONZULTACII = {
  'znacenie-pre-nevidiacich': '30-IMAG0678.jpg',
}

export const fotkaKonzultacii = (slug) => ZAZNAM_PODLA_SUBORU.get(FOTKA_KONZULTACII[slug]) || null
