import { useEffect, useRef, useState } from 'react'
import { XIcon } from 'lucide-react'
import { Dialog, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from './ui/dialog.jsx'
import { Dialog as DialogPrimitive } from 'radix-ui'
import ZadanieForm from './ZadanieForm.jsx'
import { OBHLIADKA_EVENT } from '../lib/obhliadka.js'

/**
 * Popup „Dohodnúť obhliadku“ — funkcia z pôvodného webu (Elementor popup na
 * každej stránke), dizajn nanovo v house štýle. Otvára sa CustomEventom
 * z ktoréhokoľvek CTA; fokus sa po zatvorení vracia na pôvodný prvok.
 */
export default function ObhliadkaDialog() {
  const [open, setOpen] = useState(false)
  const [typ, setTyp] = useState('')
  const opener = useRef(null)

  useEffect(() => {
    const on = (e) => {
      opener.current = document.activeElement
      setTyp(e.detail?.typPrvku ?? '')
      setOpen(true)
    }
    window.addEventListener(OBHLIADKA_EVENT, on)
    return () => window.removeEventListener(OBHLIADKA_EVENT, on)
  }, [])

  // Lenis sa pod otvoreným dialógom zastaví, aby wheel/touch neskroloval stránku.
  useEffect(() => {
    const lenis = window.__lenis
    if (!lenis) return undefined
    if (open) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="bg-[rgba(38,41,44,0.6)]" style={{ animation: 'none' }} />
        <DialogPrimitive.Content
          aria-describedby="obhliadka-popis"
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            if (opener.current && typeof opener.current.focus === 'function') opener.current.focus()
          }}
          className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-y-auto border-0 bg-[var(--color-bg)] p-6 shadow-none outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-full sm:max-w-[34rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:border sm:border-[var(--color-border)] sm:p-8"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <div className="dialog-pop">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Dohodnúť obhliadku
                </p>
                <DialogTitle className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-text)]">
                  {'Pošlite zadanie, vrátime sa s termínom obhliadky'}
                </DialogTitle>
              </div>
              <DialogPrimitive.Close
                aria-label="Zavrieť"
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center border border-[var(--color-border)] text-[var(--color-text)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-text)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>

            <DialogDescription id="obhliadka-popis" className="mt-3 font-[family-name:var(--font-body)] text-[length:var(--text-sm)] leading-[var(--leading-normal)] text-[var(--color-muted)]">
              {'Napíšte nám typ prvku, miesto a rozsah. Ozveme sa s termínom obhliadky a návrhom riešenia na mieru.'}
            </DialogDescription>

            <div className="mt-7">
              <ZadanieForm key={`${open}-${typ}`} predvolenyTyp={typ} />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
