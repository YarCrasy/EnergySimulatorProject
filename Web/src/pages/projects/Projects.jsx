import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";

import ProjectCard from "../../components/projectCard/ProjectCard";
import placeHorderImg from "../../assets/image.svg";
import { getAllProjects, createProject, deleteProject } from "../../api/projects";
import { useAuth } from "../../hooks/AuthContext";

function Projects() {

    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creatingProject, setCreatingProject] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                if (isMounted) {
                    setProjects(Array.isArray(data) ? data : []);
                    setError(null);
                }
            } catch (err) {
                console.error('No se pudieron cargar los proyectos', err);
                if (isMounted) setError('No se pudieron cargar los proyectos');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchProjects();
        return () => {
            isMounted = false;
        };
    }, []);

    // const SortAlphabeticAscendente = () => {
    //     return(
    //         <button onClick={() => alert("Ordenar A-Z")}>
    //             Ordenar A-Z
    //         </button>
    //     );
    // }

    // const SortAlphabeticDescendente = () => {
    //     return(
    //         <button onClick={() => alert("Ordenar Z-A")}>
    //             Ordenar Z-A
    //         </button>
    //     );
    // }

    // const SortLastUpdatedAscendente = () => {
    //     return(
    //         <button onClick={() => alert("Ordenar por mas reciente")}>
    //             Ordenar por mas reciente
    //         </button>
    //     );
    // } 

    // const SortLastUpdatedDescendente = () => {
    //     return(
    //         <button onClick={() => alert("Ordenar por mas antiguo")}>
    //             Ordenar por mas antiguo
    //         </button>
    //     );
    // }

    // const filterOptions = [
    //     <SortAlphabeticAscendente />,
    //     <SortAlphabeticDescendente />,
    //     <SortLastUpdatedAscendente />,
    //     <SortLastUpdatedDescendente />
    // ];

    const showCreateGuide = !loading && !error && projects.length === 0;

    const totalProjects = projects.length;
    const balancedProjects = projects.filter((project) => project?.energyEnough).length;
    const pendingProjects = totalProjects - balancedProjects;
    const totalDemand = projects.reduce(
        (acc, project) => acc + (Number(project?.energyNeeded) || 0),
        0
    );

    const formatNumber = (value) =>
        new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);

    const formatEnergy = (value) =>
        new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(value / 1000);

    const handleCreateProject = async () => {
        if (creatingProject) return;
        if (!user?.id) {
            setError("Debes iniciar sesión para crear un proyecto");
            return;
        }
        setCreatingProject(true);
        setError(null);
        try {
            // Crear un proyecto básico antes de abrir el simulador.
            const newProjectPayload = {
                name: "Nuevo Proyecto",
                energyEnough: false,
                energyNeeded: 0,
                userId: user.id
            };
            const createdProject = await createProject(newProjectPayload);
            setProjects((prev) => [...prev, createdProject]);
            navigate(`/simulator/${createdProject?.id}`);
        } catch (creationError) {
            console.error("No se pudo crear el proyecto", creationError);
            setError("No se pudo crear el proyecto");
        } finally {
            setCreatingProject(false);
        }
    };

    const handleDeleteProject = async (projectId, projectName) => {
        if (!projectId) return;
        const confirmed = window.confirm(`¿Eliminar "${projectName}"? Esta acción no se puede deshacer.`);
        if (!confirmed) return;

        try {
            setError(null);
            await deleteProject(projectId);
            setProjects((prev) => prev.filter((project) => project.id !== projectId));
        } catch (deleteError) {
            console.error("No se pudo eliminar el proyecto", deleteError);
            setError("No se pudo eliminar el proyecto");
        }
    };

    return (
        <main className="projects-page">
            <section className="projects-hero">
                <p className="projects-eyebrow">Panel de proyectos</p>
                <div className="projects-hero-header">
                    <div>
                        <h1>Diseña, simula y equilibra tus instalaciones energéticas</h1>
                        <p>
                            Visualiza el estado de cada proyecto, revisa su consumo objetivo
                            y entra al simulador con un solo clic para seguir iterando.
                        </p>
                    </div>
                    <button
                        className={`projects-cta${showCreateGuide ? " guide" : ""}`}
                        onClick={handleCreateProject}
                        disabled={creatingProject}
                    >
                        {creatingProject ? "Creando..." : "Nuevo Proyecto"}
                    </button>
                </div>

                <div className="projects-stats">
                    <article>
                        <span>{formatNumber(totalProjects)}</span>
                        <p>Proyectos activos</p>
                    </article>
                    <article>
                        <span>{formatNumber(balancedProjects)}</span>
                        <p>Balanceados</p>
                    </article>
                    <article>
                        <span>{formatNumber(pendingProjects)}</span>
                        <p>Pendientes</p>
                    </article>
                    <article>
                        <span>{formatEnergy(totalDemand)} MWh</span>
                        <p>Demanda planificada</p>
                    </article>
                </div>
            </section>

            <section className="projects-board">
                <header>
                    <div>
                        <h2>Tu inventario energético</h2>
                        <p>
                            Administra proyectos guardados, elimina los que ya no necesitas
                            y retoma cualquier simulación en progreso.
                        </p>
                    </div>
                    {/* <SearchBar
                        placeholder="Buscar proyectos..."
                        headingButton={HeadingButton.FILTER}
                        filterOptions={filterOptions}
                    /> */}
                </header>

                {loading && <p className="projects-status">Cargando proyectos...</p>}
                {error && !loading && (
                    <p className="projects-status error">{error}</p>
                )}

                {!loading && !error && (
                    <>
                        {projects.length === 0 ? (
                            <div className="projects-empty-state">
                                <h3>Aún no tienes proyectos</h3>
                                <p>
                                    Crea tu primer escenario para comenzar a simular necesidades
                                    y excedentes energéticos.
                                </p>
                                <button onClick={handleCreateProject} disabled={creatingProject}>
                                    {creatingProject ? "Creando..." : "Crear proyecto"}
                                </button>
                            </div>
                        ) : (
                            <div className="projects-grid">
                                {projects.map((project) => {
                                    const title = project.name || project.title || `Proyecto ${project.id}`;
                                    const updated = project.updatedAt || project.lastUpdated;
                                    return (
                                        <ProjectCard
                                            key={project.id}
                                            id={project.id}
                                            title={title}
                                            lastUpdated={
                                                updated
                                                    ? new Date(updated).toLocaleDateString()
                                                    : new Date().toLocaleDateString()
                                            }
                                            imageUrl={project.imageUrl || placeHorderImg}
                                            onDelete={(cardId) => handleDeleteProject(cardId, title)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

export default Projects;
