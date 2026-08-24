/**
 * Most medzi CTA po celej stránke a dialógom „Dohodnúť obhliadku“.
 * Zámerne CustomEvent na window namiesto React kontextu: dialóg je namontovaný
 * v HlavickaAHero a CTA žijú v rôznych sekciách bez spoločného providera.
 */
export const OBHLIADKA_EVENT = 'obhliadka:open'

export function openObhliadka(typPrvku) {
  window.dispatchEvent(new CustomEvent(OBHLIADKA_EVENT, { detail: { typPrvku: typPrvku ?? '' } }))
}
