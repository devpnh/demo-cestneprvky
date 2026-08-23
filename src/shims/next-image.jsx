/**
 * `next/image` stand-in (204 corpus components). Next's Image does layout work
 * a plain <img> does not, so width/height are forwarded explicitly — dropping
 * them is what causes the layout shift CHECK flags.
 */
export default function Image({ src, alt = '', width, height, fill, priority, ...rest }) {
  const style = fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined
  return (
    <img
      src={typeof src === 'string' ? src : src?.src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      style={style}
      {...rest}
    />
  )
}
