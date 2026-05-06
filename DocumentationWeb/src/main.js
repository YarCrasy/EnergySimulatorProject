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

const navLinks = Array.from(document.querySelectorAll(".sidebar a"));
const sectionsByPosition = Array.from(document.querySelectorAll("main section[id]"));

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
};

const getActiveSectionId = () => {
  const marker = window.innerHeight * 0.28;
  let activeId = sectionsByPosition[0]?.id;

  for (const section of sectionsByPosition) {
    const top = section.getBoundingClientRect().top;
    if (top <= marker) {
      activeId = section.id;
    } else {
      break;
    }
  }

  return activeId;
};

let ticking = false;

const updateActiveFromScroll = () => {
  ticking = false;
  const id = getActiveSectionId();
  if (id) {
    setActiveLink(id);
  }
};

const requestActiveUpdate = () => {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(updateActiveFromScroll);
  }
};

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.slice(1);
    if (id) {
      setActiveLink(id);
    }
  });
});

window.addEventListener("scroll", requestActiveUpdate, { passive: true });
window.addEventListener("resize", requestActiveUpdate);
window.addEventListener("hashchange", () => {
  const id = window.location.hash.slice(1);
  if (id) {
    setActiveLink(id);
  }
});

updateActiveFromScroll();
