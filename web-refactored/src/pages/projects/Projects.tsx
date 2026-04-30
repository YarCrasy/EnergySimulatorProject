import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaPlus, FaTrash } from "react-icons/fa";

import { createProject, deleteProject, getProjectsByUser } from "../../api/projects";
import { useAuth } from "../../auth/auth";
import type { Identifier } from "../../models/common";
import type { ProjectSummary } from "../../models/project";
import "./Projects.css";

const numberFormat = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });

function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await getProjectsByUser(user.id);
      if (mounted) {
        setProjects(data);
        setLoading(false);
      }
    }

    void loadProjects();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const stats = useMemo(() => {
    const balanced = projects.filter((project) => project.energyEnough).length;
    const demand = projects.reduce((acc, project) => acc + Number(project.energyNeeded ?? 0), 0);
    return { balanced, demand };
  }, [projects]);

  async function handleCreateProject() {
    if (!user?.id || creating) {
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const created = await createProject({
        name: `Proyecto ${projects.length + 1}`,
        season: "verano",
        latitude: 28.1,
        longitude: -15.4,
        timezone: "auto",
        tiltAngle: 30,
        azimuth: 0,
        durationDays: 1,
        simulationMode: "open-meteo",
        systemLossPercent: 14,
        energyEnough: false,
        energyNeeded: 0,
        userId: user.id,
        projectNodes: [],
        nodeConnections: [],
      });
      navigate(`/simulator/${created.id}`);
    } catch (creationError) {
      console.error("No se pudo crear el proyecto", creationError);
      setError("No se pudo crear el proyecto.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteProject(id: Identifier | null | undefined) {
    if (id == null || !window.confirm("Eliminar este proyecto de forma permanente?")) {
      return;
    }

    try {
      await deleteProject(id);
      setProjects((current) => current.filter((project) => project.id !== id));
    } catch (deleteError) {
      console.error("No se pudo eliminar el proyecto", deleteError);
      setError("No se pudo eliminar el proyecto.");
    }
  }

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div>
          <p className="eyebrow">Panel de proyectos</p>
          <h1>Proyectos energéticos</h1>
          <p>Organiza instalaciones, abre el simulador y revisa rapidamente el estado de cada red.</p>
        </div>
        <button type="button" className="primary-action" onClick={handleCreateProject} disabled={creating}>
          <FaPlus aria-hidden="true" />
          {creating ? "Creando..." : "Nuevo proyecto"}
        </button>
      </section>

      <section className="projects-summary" aria-label="Resumen de proyectos">
        <article>
          <span>{projects.length}</span>
          <p>Activos</p>
        </article>
        <article>
          <span>{stats.balanced}</span>
          <p>Balanceados</p>
        </article>
        <article>
          <span>{numberFormat.format(stats.demand / 1000)} kWh</span>
          <p>Demanda</p>
        </article>
      </section>

      {error && <p className="page-alert">{error}</p>}
      {loading && <p className="page-status">Cargando proyectos...</p>}

      {!loading && projects.length === 0 && (
        <section className="empty-state">
          <FaBolt aria-hidden="true" />
          <h2>Aun no hay proyectos</h2>
          <p>Crea el primer escenario para empezar a colocar elementos y simular su comportamiento.</p>
          <button type="button" className="primary-action" onClick={handleCreateProject} disabled={creating}>
            <FaPlus aria-hidden="true" />
            Crear proyecto
          </button>
        </section>
      )}

      {!loading && projects.length > 0 && (
        <section className="projects-grid" aria-label="Listado de proyectos">
          {projects.map((project) => {
            const title = project.name || project.title || `Proyecto ${project.id}`;
            return (
              <article className="project-card" key={project.id}>
                <div>
                  <p className={project.energyEnough ? "status-pill ok" : "status-pill"}>{project.energyEnough ? "Balanceado" : "Pendiente"}</p>
                  <h2>{title}</h2>
                  <p>Actualizado {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString("es-ES") : "recientemente"}</p>
                </div>
                <dl>
                  <div>
                    <dt>Temporada</dt>
                    <dd>{project.season ?? "verano"}</dd>
                  </div>
                  <div>
                    <dt>Demanda</dt>
                    <dd>{numberFormat.format(Number(project.energyNeeded ?? 0) / 1000)} kWh</dd>
                  </div>
                </dl>
                <div className="project-card-actions">
                  <Link to={`/simulator/${project.id}`}>Abrir simulador</Link>
                  <button type="button" aria-label="Eliminar proyecto" onClick={() => handleDeleteProject(project.id)}>
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Projects;
