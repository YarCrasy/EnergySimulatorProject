import "./CardPanel.css"
import placeholderImg from "../../assets/image.svg";

function CardPanel({imgSrc = placeholderImg, id, model, wattage}) {
  return (
    <div className="card-panel">
      <img src={imgSrc} alt="solar-panel" />

      <div className="panel-content" id={`id-${id}`}>
        <h2 className="panel-model">{model}</h2>
        <div className="panel-watios">{wattage} kw/h</div>
      </div>

    </div>
  );
}

export default CardPanel;
