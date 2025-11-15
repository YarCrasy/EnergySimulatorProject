import { useEffect, useState } from "react";
import "../App.css";

export default function ForceOrientation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Match portrait orientation on small devices (matches existing CSS breakpoint)
    const mq = window.matchMedia("(orientation: portrait) and (max-width: 600px)");

    const update = (e) => setShow(typeof e === 'object' && 'matches' in e ? e.matches : mq.matches);
    update();

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
    } else if ('onchange' in mq) {
      mq.onchange = update;
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(update);
    }

    const handleResize = () => update();
    window.addEventListener('resize', handleResize);

    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', update);
      } else if ('onchange' in mq) {
        mq.onchange = null;
      } else if (typeof mq.removeListener === 'function') {
        mq.removeListener(update);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="force-orientation" role="dialog" aria-hidden={!show}>
      <h2>Por favor, gira tu dispositivo para una mejor experiencia.</h2>
    </div>
  );
}
