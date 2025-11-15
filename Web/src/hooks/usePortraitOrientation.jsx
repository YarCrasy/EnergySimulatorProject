import { useEffect, useState } from 'react'

export default function usePortraitOrientation(maxWidth = 600) {
  const [isPortraitSmall, setIsPortraitSmall] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mqStr = `(orientation: portrait) and (max-width: ${maxWidth}px)`
    const mq = window.matchMedia(mqStr)

    const update = (e) => {
      setIsPortraitSmall(typeof e === 'object' && 'matches' in e ? e.matches : mq.matches)
    }

    // initial value
    update()

    // Attach listener: prefer modern addEventListener, fallback to onchange, then legacy addListener
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update)
    } else if ('onchange' in mq) {
      mq.onchange = update
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(update)
    }

    // also update on resize as a safety net
    window.addEventListener('resize', update)

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', update)
      } else if ('onchange' in mq) {
        mq.onchange = null
      } else if (typeof mq.removeListener === 'function') {
        mq.removeListener(update)
      }
      window.removeEventListener('resize', update)
    }
  }, [maxWidth])

  return isPortraitSmall
}
