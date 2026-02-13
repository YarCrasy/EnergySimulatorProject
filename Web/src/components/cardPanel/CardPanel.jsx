import "./CardPanel.css";
import placeholderImg from "@svg/image.svg";

function CardPanel({
  imgSrc = placeholderImg,
  id,
  model,
  wattage,
  draggable = false,
  onDragStart,
  onClick
}) {
  const formattedPower = (() => {
    const numeric = Number(wattage);
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 1
      }).format(numeric) + " W";
    }
    if (typeof wattage === "string" && wattage.trim().length > 0) {
      return wattage;
    }
    return "Sin dato";
  })();

  return (
    <div
      className={`card-panel${draggable ? " is-draggable" : ""}`}
      draggable={draggable}
      onDragStart={(event) => {
        if (!draggable) {
          return;
        }
        event.dataTransfer.effectAllowed = "copy";
        if (typeof onDragStart === "function") {
          onDragStart(event);
        }
      }}
      onClick={onClick}
      data-element-id={id}
    >
      <div className="panel-media" aria-hidden="true">
        <img src={imgSrc} alt="" loading="lazy" />
      </div>

      <div className="panel-content" id={`id-${id}`}>
        <p className="panel-eyebrow">Elemento #{id ?? "—"}</p>
        <h2 className="panel-model">{model}</h2>
        <div className="panel-watios">{formattedPower}</div>
      </div>
    </div>
  );
}

export default CardPanel;
