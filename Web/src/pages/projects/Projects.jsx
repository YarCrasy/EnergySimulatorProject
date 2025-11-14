import "./Projects.css";

import {SearchBar, HeadingButton} from "../../components/searchBar/SearchBar";
import ProjectCard from "../../components/projectCard/ProjectCard";
import placeHorderImg from "../../assets/image.svg"

function Projects() {
    return (
        <main className="projects-page">
            <div className="top-bar">
                <SearchBar placeholder="Buscar proyectos..." headingButton={HeadingButton.FILTER} />
                <button>
                    Login
                </button>
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
            
        </main>
    );
}

export default Projects;
