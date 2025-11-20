import { useEffect, useState } from 'react'

export default function usePortraitOrientation() {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const update = () => {
      const { innerWidth: width, innerHeight: height } = window;
      setIsPortrait(height > width);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return isPortrait;
}
