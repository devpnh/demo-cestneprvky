/**
 * Farebný opar na tmavom pásme. Tri rozostrené škvrny, každá s vlastnou
 * dráhou a vlastným časom obehu, takže sa navzájom míňajú a prekrývajú —
 * pohyb potom nemá počuteľný takt a nedá sa naň „chytiť“ oko.
 *
 * Predchádzajúca verzia posúvala jednou animáciou celú vrstvu naraz: tri
 * škvrny sa hýbali ako jeden kus tapety a vyzeralo to skôr ako pomalý pan
 * než ako opar. Tu má každá škvrna vlastný `@keyframes` s nesúdeliteľnou
 * dĺžkou (26 s, 34 s, 41 s), takže sa celý obrazec zopakuje až po hodinách.
 *
 * Krytie je zámerne nízke (0,34 spolu): pod oparom stojí biely text pätičky
 * a červená plocha pod bielym 14 px textom má len 4,05 : 1. Pri tomto krytí
 * ostáva podklad prakticky tmavý a text si drží svoj pomer voči pásmu.
 *
 * Animácie sú v `src/styles/index.css` (`mesh-a/b/c`), nie v inline `<style>`
 * ako predtým — inline verzia vkladala tú istú definíciu znova pri každom
 * použití komponentu.
 */

/** Škvrna: farba, poloha, veľkosť a ktorá dráha ju vedie. */
const SKVRNY = [
  { farba: 'var(--color-accent)', left: '8%', top: '35%', velkost: '46%', drahá: 'mesh-a' },
  { farba: 'var(--color-accent-deep)', left: '58%', top: '-10%', velkost: '54%', drahá: 'mesh-b' },
  { farba: 'var(--color-accent-2)', left: '30%', top: '55%', velkost: '62%', drahá: 'mesh-c' },
]

export default function GradientMesh({ className = '', krytie = 0.34 }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: krytie }}
    >
      {SKVRNY.map((s) => (
        <div
          key={s.drahá}
          className={`absolute rounded-full ${s.drahá}`}
          style={{
            left: s.left,
            top: s.top,
            width: s.velkost,
            // Kruh, nie ovál: výška z rovnakého percenta by sa počítala z
            // výšky rodiča a škvrna by sa deformovala s každou zmenou
            // obsahu pätičky.
            aspectRatio: '1',
            background: `radial-gradient(circle, ${s.farba} 0%, transparent 68%)`,
            filter: 'blur(70px)',
          }}
        />
      ))}
    </div>
  )
}
