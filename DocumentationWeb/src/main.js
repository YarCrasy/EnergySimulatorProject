import "../styles.css";
import navigationHtml from "./navigation.html?raw";
import { sections } from "./sections/index.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="doc-shell">
    <aside class="sidebar">
      <h1>Simulador de Energías Renovables</h1>
      <p>Documentación final del Proyecto Intermodular.</p>
      <nav>
        ${navigationHtml}
      </nav>
    </aside>

    <main class="content">
      <div class="top-actions">
        <button class="button secondary" type="button" id="print-document">Imprimir documentación completa / guardar PDF</button>
      </div>
      ${sections.join("\n")}
    </main>
  </div>
`;

document.querySelector("#print-document")?.addEventListener("click", () => window.print());
