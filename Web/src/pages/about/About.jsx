import "./About.css";
import domestic from "../../images/domestic.jpg";
import comunity from "../../images/comunity.jpg";
import industrial from "../../images/industrial.jpg";
import greenWorld from "../../images/greenWorld.jpg";
import innovation from "../../images/innovation.jpg";

function About() {
  return (
    <section className="about-us">
      <div className="section-header">
        <h2>Quiénes somos</h2>
        <p>
          Comprometidos con la energía sostenible y el ahorro energético para
          todos
        </p>
      </div>

      <div className="about-values">
        <div className="value-card">
          <h3>Sostenibilidad</h3>
          <p>
            Promovemos la energía limpia y el cuidado del planeta en todos
            nuestros proyectos.
          </p>
           <div className="green-world-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${greenWorld}) center/cover no-repeat`,
            }}></div>
        </div>

        <div className="value-card">
          <h3>Innovación</h3>
          <p>
            Usamos la tecnología más avanzada para maximizar el rendimiento
            solar.
          </p>
            <div className="innovation-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${innovation}) center/cover no-repeat`,
            }}></div>
          
        </div>

        <div className="value-card">
          <h3>Confianza</h3>
          <p>
            Clientes satisfechos gracias a proyectos transparentes y
            personalizados.
          </p>
           <div className="green-world-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${greenWorld}) center/cover no-repeat`,
            }}></div>
          
        </div>

        <div className="solutions">
          <h3>Invierte en tu ahorro</h3>

          <div className="comercial">
            <div className="domestic-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${domestic}) center/cover no-repeat`,
            }}>
              <div>
                <h4>60-70%</h4>
                <p>Instalaciones Domésticas</p>
              </div>
            </div>

            <div className="comunity-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${comunity}) center/cover no-repeat`,
            }}>
              <div>
                <h4>60-70%</h4>
                <p>Instalaciones Comunitarias</p>
              </div>
            </div>

            <div className="industrial-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${industrial}) center/cover no-repeat`,
            }}>
              <div>
                <h4>60-70%</h4>
                <p>Instalaciones Industriales</p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-about">
          <p>¿Quieres aprovechar la energía solar en tu hogar o empresa?</p>
          <a href="/contact" className="btn-cta">
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
