function CardPanel({imgSrc, id, model, wattage}) {
  return (
    <div className="card-panel">
      <div className="image-container">
        <img src={imgSrc} alt="solar-panel" />
      </div>

      <div className="panel-content" id={`id-${id}`}>
        <h1 className="panel-model">{model}</h1>
        <div className="panel-watios">{wattage} kw/h</div>
      </div>

    </div>
  );
}

export default CardPanel;
