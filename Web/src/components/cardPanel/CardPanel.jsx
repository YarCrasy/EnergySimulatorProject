function CardPanel() {
  return (
    <div className="card-panel">
      <div className="image-container">
        <img src="/solar-panel.png" alt="solar-panel" />
      </div>

      <div className="panel-content" id="id-placa">
        <h1 className="panel-model">Modelo panel solar</h1>
        <div className="panel-eficience">Eficiencia</div>
        <div className="panel-watios">230 kw/h</div>
      </div>

    </div>
  );
}

export default CardPanel;
