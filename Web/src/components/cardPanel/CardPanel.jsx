import "./CardPanel.css"
import placeholderImg from "../../assets/image.svg";

function CardPanel({
  imgSrc = placeholderImg,
  id,
  model,
  wattage,
  draggable = false,
  onDragStart,
  onClick
}) {
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
      <img src={imgSrc} alt="solar-panel" />

      <div className="panel-content" id={`id-${id}`}>
        <h2 className="panel-model">{model}</h2>
        <div className="panel-watios">{wattage} kw/h</div>
      </div>

    </div>
  );
}

export default CardPanel;
