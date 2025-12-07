import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";

import {SearchBar, HeadingButton} from "../../components/searchBar/SearchBar";
import ProjectCard from "../../components/projectCard/ProjectCard";
import placeHorderImg from "../../assets/image.svg"
import { getAllProjects, createProject, deleteProject } from "../../api/projects";
import UserProfile from "../../components/userProfile/UserProfile";
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
            {/* <div className="top-bar">
                <SearchBar placeholder="Buscar proyectos..." headingButton={HeadingButton.FILTER} filterOptions={filterOptions} />
                <UserProfile menu={
                    <ul>
                        <li>Mi Perfil</li>
                        <li>Configuración</li>
                        <li>Cerrar Sesión</li>
                    </ul>
                } />
            </div> */}
            {loading && <p className="projects-status">Cargando proyectos...</p>}
            {error && !loading && <p className="projects-status error">{error}</p>}
            <div className="projects-list">
                {
                    projects.map((project) => {
                        const title = project.name || project.title || `Proyecto ${project.id}`;
                        const updated = project.updatedAt || project.lastUpdated;
                        return (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                title={title}
                                lastUpdated={updated ? new Date(updated).toLocaleDateString() : new Date().toLocaleDateString()}
                                imageUrl={project.imageUrl || placeHorderImg}
                                onDelete={(cardId) => handleDeleteProject(cardId, title)}
                            />
                        );
                    })
                }
                {showCreateGuide && (
                    <p className="projects-empty-hint">
                        Aún no tienes proyectos. Pulsa “Nuevo Proyecto” para comenzar.
                    </p>
                )}
            </div>
            <button
                className={`create-project-button${showCreateGuide ? " guide" : ""}`}
                onClick={handleCreateProject}
                disabled={creatingProject}
            >
                {creatingProject ? "..." : "Nuevo Proyecto"}
            </button>
        </main>
    );
}

export default Projects;
