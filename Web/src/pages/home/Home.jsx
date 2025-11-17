import "./Home.css";
import home from "../../images/home.jpg";

function Home() {
  return (
    <div className="home-container">
      <div
        className="home-image"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${home}) center/cover no-repeat`,
        }}
      >
        <h1>Bienvenido al Simulador de Energía Renovable</h1>
        <p>
          Explore diferentes fuentes de energía renovable y simule su impacto en
          el medio ambiente y en su factura.
        </p>
      </div>
    </div>
  );
}
export default Home;
