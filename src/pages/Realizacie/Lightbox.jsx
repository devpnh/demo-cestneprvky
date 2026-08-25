import { useCallback, useEffect, useRef } from 'react'
import { SIZES_PLNA, srcSetPre } from '../../lib/obrazky.js'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, ArrowLeft, ArrowRight } from 'lucide-react'
import { sluzbaPodlaSlugu } from '../../content/sluzby.js'
import { castiPopisu } from './skupiny.js'

const BASE = import.meta.env.BASE_URL

const TRIEDA_TLACIDLA =
  'inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center border border-[rgba(255,255,255,0.28)] text-[var(--color-bg)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]'

/**
 * Veľký náhľad jednej realizácie.
 *
 * Renderuje sa cez `createPortal` do `document.body`, nikdy do stromu
 * stránky: hlavička webu má `backdrop-filter` a filtrovaný predok mení
 * `position: fixed` potomka na absolútne pozicovaný (STANDARDY C7, doložený
 * pád v tomto projekte). Portál do `body` je jediné miesto, kde `fixed`
 * naozaj drží na viewporte.
 *
 * Pozadie (`#root`) dostáva `aria-hidden` aj `inert`, takže sa doň nedá
 * dostať čítačkou ani tabulátorom; scroll je zamknutý na `document.body`
 * a Lenisu sa povie `stop()`, inak by koliesko skrolovalo stránku pod
 * náhľadom.
 */
export default function Lightbox({ polozky, index, onZavri, onPrepni }) {
  const polozka = polozky[index]
  const dialogRef = useRef(null)
  const zatvorRef = useRef(null)

  const klavesa = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onZavri()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onPrepni(1)
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrepni(-1)
        return
      }
      if (e.key !== 'Tab') return
      // Pasca na fokus: `inert` na #root drží fokus mimo pozadia, tento cyklus
      // ho drží aj mimo prehliadačovej lišty a adresného riadka.
      const ohniska = dialogRef.current?.querySelectorAll('a[href], button:not([disabled])')
      if (!ohniska || ohniska.length === 0) return
      const prvy = ohniska[0]
      const posledny = ohniska[ohniska.length - 1]
      if (e.shiftKey && document.activeElement === prvy) {
        e.preventDefault()
        posledny.focus()
      } else if (!e.shiftKey && document.activeElement === posledny) {
        e.preventDefault()
        prvy.focus()
      }
    },
    [onZavri, onPrepni],
  )

  useEffect(() => {
    document.addEventListener('keydown', klavesa)
    return () => document.removeEventListener('keydown', klavesa)
  }, [klavesa])

  useEffect(() => {
    const root = document.getElementById('root')
    const povodnyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (window.__lenis) window.__lenis.stop()
    if (root) {
      root.setAttribute('aria-hidden', 'true')
      root.setAttribute('inert', '')
    }
    zatvorRef.current?.focus()
    return () => {
      document.body.style.overflow = povodnyOverflow
      if (window.__lenis) window.__lenis.start()
      if (root) {
        root.removeAttribute('aria-hidden')
        root.removeAttribute('inert')
      }
    }
  }, [])

  if (!polozka) return null

  const sluzba = sluzbaPodlaSlugu(polozka.sluzba)

  return createPortal(
    <div
      ref={dialogRef}
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografia: ${polozka.prvok}`}
      className="fixed inset-0 z-[80] flex flex-col bg-[var(--color-surface-2)] text-[var(--color-bg)]"
    >
      <div className="flex items-center justify-between gap-4 px-[var(--container-padding-x)] py-4">
        <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
          {`${index + 1} z ${polozky.length}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPrepni(-1)}
            aria-label="Predchádzajúca fotografia"
            className={TRIEDA_TLACIDLA}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onPrepni(1)}
            aria-label="Nasledujúca fotografia"
            className={TRIEDA_TLACIDLA}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            ref={zatvorRef}
            type="button"
            onClick={onZavri}
            aria-label="Zavrieť náhľad"
            data-lightbox-zavri
            className={TRIEDA_TLACIDLA}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-[var(--container-padding-x)] py-2">
        <img
          key={polozka.id}
          data-lightbox-img
          src={`${BASE}assets/${polozka.src}`}
          srcSet={srcSetPre(polozka.src, polozka.w)}
          sizes={SIZES_PLNA}
          width={polozka.w}
          height={polozka.h}
          alt={polozka.alt}
          decoding="async"
          className="max-h-full w-auto max-w-full object-contain"
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>

      <div
        className="border-t px-[var(--container-padding-x)] pb-14 pt-5 sm:pb-5"
        style={{ borderColor: 'color-mix(in srgb, var(--color-bg) 18%, transparent)' }}
      >
        <div className="mx-auto flex max-w-[var(--container-max)] flex-wrap items-baseline gap-x-8 gap-y-2">
          <p className="font-[family-name:var(--font-body)] text-[length:var(--text-lg)] font-medium leading-[var(--leading-normal)] text-[var(--color-bg)]">
            {polozka.prvok}
          </p>
          {/* Pravidlo popisku je v `skupiny.js`, spoločné s mriežkou aj s Domovom. */}
          <p className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
            {castiPopisu(polozka).map((cast, j) => (
              <span key={cast}>
                {j > 0 ? (
                  <span aria-hidden="true" className="mx-3 text-[rgba(255,255,255,0.72)]">
                    ·
                  </span>
                ) : null}
                {cast}
              </span>
            ))}
          </p>
          {/* Typ prvku a názov služby sú pri niektorých fotkách tá istá veta
              (napr. „Vodorovné dopravné značenie“), preto má odkaz mono štítok
              — inak by to vyzeralo ako zdvojený text. */}
          {sluzba ? (
            <span className="flex flex-wrap items-center gap-x-3">
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.72)]">
                {'Služba'}
              </span>
              <Link
                to={`/sluzby/${sluzba.slug}`}
                onClick={onZavri}
                className="inline-flex min-h-[44px] items-center font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium text-[var(--color-bg)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                {sluzba.nazov}
              </Link>
            </span>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}
