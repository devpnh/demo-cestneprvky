import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * Animated CSS gradient mesh background — no canvas, no three.js. Three
 * radial gradients drift slowly via a CSS keyframe. Reads --color-accent /
 * --color-accent-2 / --color-surface from tokens.css by default, so it
 * rebrands for free; pass `colors` to override.
 */
export default function GradientMesh({ className, colors, ...props }) {
  const reduced = useReducedMotion()
  const palette = colors || ['var(--color-accent)', 'var(--color-accent-2)', 'var(--color-surface)']

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      {...props}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `radial-gradient(circle at 20% 30%, ${palette[0]} 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${palette[1]} 0%, transparent 50%),
                       radial-gradient(circle at 50% 80%, ${palette[2]} 0%, transparent 50%)`,
          filter: 'blur(60px)',
          opacity: 0.5,
          animation: reduced ? 'none' : 'demogen-mesh-drift 20s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes demogen-mesh-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, -4%) scale(1.05); }
          66% { transform: translate(-3%, 3%) scale(0.98); }
        }
      `}</style>
    </div>
  )
}
