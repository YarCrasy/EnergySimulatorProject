import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";

import {SearchBar, HeadingButton} from "../../components/searchBar/SearchBar";
import ProjectCard from "../../components/projectCard/ProjectCard";
import placeHorderImg from "../../assets/image.svg"
import { getAllProjects, createProject } from "../../api/projects";
import UserProfile from "../../components/userProfile/UserProfile";

function Projects() {

    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creatingProject, setCreatingProject] = useState(false);
    const navigate = useNavigate();

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

    const SortAlphabeticAscendente = () => {
        return(
            <button onClick={() => alert("Ordenar A-Z")}>
                Ordenar A-Z
            </button>
        );
    }

    const SortAlphabeticDescendente = () => {
        return(
            <button onClick={() => alert("Ordenar Z-A")}>
                Ordenar Z-A
            </button>
        );
    }

    const SortLastUpdatedAscendente = () => {
        return(
            <button onClick={() => alert("Ordenar por mas reciente")}>
                Ordenar por mas reciente
            </button>
        );
    } 

    const SortLastUpdatedDescendente = () => {
        return(
            <button onClick={() => alert("Ordenar por mas antiguo")}>
                Ordenar por mas antiguo
            </button>
        );
    }

    const filterOptions = [
        <SortAlphabeticAscendente />,
        <SortAlphabeticDescendente />,
        <SortLastUpdatedAscendente />,
        <SortLastUpdatedDescendente />
    ];

    const handleCreateProject = async () => {
        if (creatingProject) return;
        setCreatingProject(true);
        setError(null);
        try {
            const now = new Date();
            // Crear un proyecto básico antes de abrir el simulador.
            const newProjectPayload = {
                title: `Nuevo proyecto ${now.toLocaleDateString()}`,
                lastUpdated: now.toISOString(),
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

    return (
        <main className="projects-page">
            <div className="top-bar">
                <SearchBar placeholder="Buscar proyectos..." headingButton={HeadingButton.FILTER} filterOptions={filterOptions} />
                <UserProfile menu={
                    <ul>
                        <li>Mi Perfil</li>
                        <li>Configuración</li>
                        <li>Cerrar Sesión</li>
                    </ul>
                } />
            </div>
            {loading && <p className="projects-status">Cargando proyectos...</p>}
            {error && !loading && <p className="projects-status error">{error}</p>}
            <div className="projects-list">
                {
                    projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            title={project.title || `Proyecto ${project.id}`}
                            lastUpdated={project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}
                            imageUrl={project.imageUrl || placeHorderImg}
                        />
                    ))
                }
            </div>
            <button
                className="create-project-button"
                onClick={handleCreateProject}
                disabled={creatingProject}
            >
                {creatingProject ? "..." : "+"}
            </button>
        </main>
    );
}

export default Projects;
