import type { MouseEvent, TouchEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./ProjectCard.css";

const LONG_PRESS_DELAY = 600;

interface ProjectCardProps {
    id: number | string;
    title: string;
    lastUpdated?: string;
    imageUrl?: string;
    onOpen?: (id: number | string) => void;
    onDelete?: (id: number | string) => void;
}

function ProjectCard({ id, title, lastUpdated, imageUrl, onOpen, onDelete }: ProjectCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);
    const longPressTimeoutRef = useRef<number | null>(null);
    const longPressTriggeredRef = useRef(false);
    const navigate = useNavigate();

    const openContextMenu = (x: number, y: number) => {
        setMenuPos({ x, y });
        setMenuOpen(true);
    };

    const clearLongPressTimeout = () => {
        if (!longPressTimeoutRef.current) return;
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
    };

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches.length !== 1) return;
        const { clientX, clientY } = e.touches[0];
        clearLongPressTimeout();
        longPressTriggeredRef.current = false;
        longPressTimeoutRef.current = window.setTimeout(() => {
            longPressTriggeredRef.current = true;
            openContextMenu(clientX, clientY);
        }, LONG_PRESS_DELAY);
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
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

    const handleCardClick = (e: MouseEvent<HTMLAnchorElement>) => {
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
        const handleClickOutside = (e: MouseEvent | globalThis.MouseEvent) => {
            if (containerRef.current && e.target instanceof Node && !containerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
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
            className="project-card-shell"
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchCancel={handleTouchCancel}
        >
            <Link
                to={`/simulator/${id}`}
                className="project-card"
                onClick={handleCardClick}
            >
                <div className="project-card-media">
                    {imageUrl && (
                        <img src={imageUrl} alt={title} className="project-image" loading="lazy" />
                    )}
                    <span className="project-card-pill">
                        {lastUpdated ? `Actualizado ${lastUpdated}` : "Sin registro"}
                    </span>
                </div>

                <div className="project-card-body">
                    <p className="project-card-eyebrow">Proyecto #{id}</p>
                    <h3 className="project-title">{title}</h3>
                    <p className="project-description">
                        Haz click para abrir el simulador y continuar con tu diseño.
                    </p>
                </div>

                <div className="project-card-footer">
                    <button
                        type="button"
                        className="project-card-btn"
                        onClick={handleOpen}
                    >
                        Abrir simulador
                    </button>

                    {/* 🔹 NUEVO: botón accesible para tests */}
                    <button
                        type="button"
                        aria-label="menu"
                        className="project-card-menu-btn"
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            const rect = e.currentTarget.getBoundingClientRect();
                            openContextMenu(rect.right, rect.bottom);
                        }}
                    >
                        ⋮
                    </button>
                </div>
            </Link>

            {menuOpen && (
                <ul
                    role="menu"
                    data-testid="menu"
                    className="project-context-menu"
                    style={{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }}
                >
                    <li onClick={handleOpen}>Abrir</li>
                    <li onClick={handleDelete}>Eliminar</li>
                </ul>
            )}
        </div>
    );
}

export default ProjectCard;
