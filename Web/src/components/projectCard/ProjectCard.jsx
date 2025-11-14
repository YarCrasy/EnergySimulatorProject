import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./ProjectCard.css";

function ProjectCard({ id, title, lastUpdated, imageUrl, onOpen, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
        setMenuOpen(true);
    };

    const handleOpen = () => {
        setMenuOpen(false);
        if (onOpen) return onOpen(id);
        navigate(`/simulator/${id}`);
    };

    const handleDelete = () => {
        setMenuOpen(false);
        if (onDelete) return onDelete(id);
        if (window.confirm("¿Eliminar el proyecto? Esta acción no se puede deshacer.")) {
            console.log("Eliminar proyecto:", id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        const handleScroll = () => setMenuOpen(false);

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    return (
        <div ref={containerRef} className="project-card-container" onContextMenu={handleContextMenu}>
            <Link to={`/simulator/${id}`} className="project-card">
                {imageUrl && <img src={imageUrl} alt={title} className="project-image" />}
                <div className="project-info">
                    <h3 className="project-title">{title}</h3>
                    <p className="project-description">Last updated at: {lastUpdated}</p>
                </div>
            </Link>

            {menuOpen && (
                <ul
                    className="context-menu"
                    style={{ top: menuPos.y + "px", left: menuPos.x + "px" }}
                >
                    <li className="context-menu__item" onClick={handleOpen}>Abrir</li>
                    <li className="context-menu__item" onClick={handleDelete}>Eliminar</li>
                </ul>
            )}
        </div>
    );
}

export default ProjectCard;