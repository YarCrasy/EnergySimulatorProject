import "./Projects.css";

import {SearchBar, HeadingButton} from "../../components/searchBar/SearchBar";
import ProjectCard from "../../components/projectCard/ProjectCard";
import placeHorderImg from "../../assets/image.svg"
import userProfile from "../../assets/user-profile.svg";

function Projects() {
    // Menú desplegable controlado por CSS al hacer hover sobre el icono de perfil

    return (
        <main className="projects-page">
            <div className="top-bar">
                <SearchBar placeholder="Buscar proyectos..." headingButton={HeadingButton.FILTER} />
                <div className="profile-wrapper">
                    <img src={userProfile} className="user-profile-icon" alt="Perfil" />
                    <div className="profile-menu">
                        <ul>
                            <li>Mi Perfil</li>
                            <li>Configuración</li>
                            <li>Cerrar Sesión</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="projects-list">
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
                        <ProjectCard
                            key={key}
                            id={key}
                            title={`Proyecto ${key}`}
                            lastUpdated={new Date().toLocaleDateString()}
                            imageUrl={placeHorderImg}
                        />
                    ))
                }
            </div>
            <button className="create-project-button">
                +
            </button>
        </main>
    );
}

export default Projects;
