import { useEffect, useState } from "react";
import "./ForceOrientation.css";

import rotate from "@svg/rotate.svg";

export default function ForceOrientation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Activar el panel si el height es mayor que el width
    const update = () => {
      const { innerWidth: width, innerHeight: height } = window;
      setShow(height > width);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="force-orientation" role="dialog" aria-hidden={!show} aria-modal={show} aria-labelledby="force-orientation-title">
      <h2 id="force-orientation-title">Por favor, gira tu dispositivo para una mejor experiencia.</h2>
      <img src={rotate} alt="Rotate device icon" className="rotate-img" />
    </div>
  );
}
