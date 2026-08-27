import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../lib/utils.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'

/**
 * Kinetický text: jeden riadok, ktorý sa vymieňa po znakoch.
 *
 * Port komponentu `TextRotate` (21st.dev, `motion/react`) do JSX a do
 * domácich pravidiel. Prevzatá je celá logika delenia a oneskorení — mení sa
 * len to, čo si žiada tento web:
 *
 * 1. **`prefers-reduced-motion`**: nič sa netočí ani nehýbe. Riadok stojí na
 *    aktuálnom texte a `jumpTo` ho prepne skokom. Ostatné primitívy sa pýtajú
 *    `useReducedMotion()` samy, tak sa pýta aj tento (README, Primitives).
 * 2. **Text nesie sr-only kópia**, animovaná vrstva je `aria-hidden`. Čítačka
 *    tak dostane vetu raz a bez rozsypaných znakov.
 * 3. Žiadna farba, font ani tieň — všetko dedí z rodiča cez triedy volajúceho.
 *
 * Pohybový slovník webu má štyri slová (KOMPOZÍCIA 1a) a toto je piate, preto
 * platí pre neho to isté obmedzenie ako pre sticky-scrub: **rotátor nesmie
 * bežať sám od seba na dvoch miestach naraz.** Na Domove ho riadia dva už
 * existujúce stavy — striedanie záberov hero videa a aktívna služba na
 * kruhovom objazde. Nový nekonečný takt tým na stránku nepribúda.
 *
 * `auto={false}` + `ref.jumpTo(i)` je presne ten režim z ukážky v podklade:
 * text skáče na to, čo má návštevník práve pred očami.
 */
const TextRotate = forwardRef(function TextRotate(
  {
    texts,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion()
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  /** Delenie na grafémy, nie na kódové jednotky: „ť“, „ô“ ani emoji sa nesmú roztrhnúť. */
  const splitIntoCharacters = (text) => {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new Intl.Segmenter('sk', { granularity: 'grapheme' })
      return Array.from(segmenter.segment(text), ({ segment }) => segment)
    }
    return Array.from(text)
  }

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex] ?? ''
    if (splitBy === 'characters') {
      const slova = currentText.split(' ')
      return slova.map((slovo, i) => ({
        characters: splitIntoCharacters(slovo),
        needsSpace: i !== slova.length - 1,
      }))
    }
    if (splitBy === 'words') return currentText.split(' ')
    if (splitBy === 'lines') return currentText.split('\n')
    return currentText.split(splitBy)
  }, [texts, currentTextIndex, splitBy])

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars
      if (staggerFrom === 'first') return index * staggerDuration
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * total)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [staggerFrom, staggerDuration],
  )

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex)
      if (onNext) onNext(newIndex)
    },
    [onNext],
  )

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex)
  }, [currentTextIndex, texts.length, loop, handleIndexChange])

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex)
  }, [currentTextIndex, texts.length, loop, handleIndexChange])

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1))
      if (validIndex !== currentTextIndex) handleIndexChange(validIndex)
    },
    [texts.length, currentTextIndex, handleIndexChange],
  )

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0)
  }, [currentTextIndex, handleIndexChange])

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset])

  useEffect(() => {
    if (!auto || reduced) return undefined
    const id = setInterval(next, rotationInterval)
    return () => clearInterval(id)
  }, [next, rotationInterval, auto, reduced])

  // Pri reduced-motion nevzniká ani `AnimatePresence`, ani vrstva so znakmi:
  // je to obyčajný riadok textu, ktorý sa prepíše.
  if (reduced) {
    return (
      <span className={cn('inline-block', mainClassName)} {...props}>
        {texts[currentTextIndex]}
      </span>
    )
  }

  return (
    <motion.span className={cn('flex flex-wrap whitespace-pre-wrap', mainClassName)} {...props} layout transition={transition}>
      <span className="sr-only">{texts[currentTextIndex]}</span>

      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn('flex flex-wrap', splitBy === 'lines' && 'w-full flex-col')}
          layout
          aria-hidden="true"
        >
          {(splitBy === 'characters'
            ? elements
            : elements.map((el, i) => ({ characters: [el], needsSpace: i !== elements.length - 1 }))
          ).map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, word) => sum + word.characters.length, 0)

            return (
              <span key={wordIndex} className={cn('inline-flex', splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    key={charIndex}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(
                        previousCharsCount + charIndex,
                        array.reduce((sum, word) => sum + word.characters.length, 0),
                      ),
                    }}
                    className={cn('inline-block', elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
              </span>
            )
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
})

export default TextRotate
