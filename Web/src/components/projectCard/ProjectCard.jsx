import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./ProjectCard.css";

const LONG_PRESS_DELAY = 600;

function ProjectCard({ id, title, lastUpdated, imageUrl, onOpen, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const longPressTimeoutRef = useRef(null);
    const longPressTriggeredRef = useRef(false);
    const navigate = useNavigate();

    const openContextMenu = (x, y) => {
        setMenuPos({ x, y });
        setMenuOpen(true);
    };

    const clearLongPressTimeout = () => {
        if (!longPressTimeoutRef.current) return;
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        const { clientX, clientY } = e.touches[0];
        clearLongPressTimeout();
        longPressTriggeredRef.current = false;
        longPressTimeoutRef.current = window.setTimeout(() => {
            longPressTriggeredRef.current = true;
            openContextMenu(clientX, clientY);
        }, LONG_PRESS_DELAY);
    };

    const handleTouchEnd = (e) => {
        if (longPressTimeoutRef.current) {
            clearLongPressTimeout();
        }
        if (longPressTriggeredRef.current) {
            e.preventDefault();
            longPressTriggeredRef.current = false;
        }
    };

    const handleTouchMove = () => {
        clearLongPressTimeout();
    };

    const handleTouchCancel = () => {
        clearLongPressTimeout();
        longPressTriggeredRef.current = false;
    };

    const handleOpen = () => {
        setMenuOpen(false);
        if (onOpen) return onOpen(id);
        navigate(`/simulator/${id}`);
    };

    const handleCardClick = (e) => {
        if (menuOpen) {
            e.preventDefault();
            setMenuOpen(false);
            return;
        }
        if (onOpen) {
            e.preventDefault();
            onOpen(id);
        }
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

    useEffect(() => {
        return () => {
            clearLongPressTimeout();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="project-card-container"
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchCancel={handleTouchCancel}
        >
            <Link to={`/simulator/${id}`} className="project-card" onClick={handleCardClick}>
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
                    <li className="context-menu_item" onClick={handleOpen}>Abrir</li>
                    <li className="context-menu_item" onClick={handleDelete}>Eliminar</li>
                </ul>
            )}
        </div>
    );
}

export default ProjectCard;