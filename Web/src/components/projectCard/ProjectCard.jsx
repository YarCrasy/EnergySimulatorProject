import "./ProjectCard.css";

function ProjectCard({ title, lastUpdated, imageUrl }) {
    return (
        <div className="project-card">
            {imageUrl && <img src={imageUrl} alt={title} className="project-image" />}
            <div className="project-info">
                <h3 className="project-title">{title}</h3>
                <p className="project-description">Last updated at: {lastUpdated}</p>
            </div>
        </div>
    );
}

export default ProjectCard;