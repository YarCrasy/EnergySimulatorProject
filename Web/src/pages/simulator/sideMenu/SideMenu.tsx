import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./SideMenu.css";

import CardPanel from "../../../components/cardPanel/CardPanel";
import { getAllElements } from "../../../api/elements";
import { resolveElementWattage } from "@/Models/element.model";
import backBtn from "@svg/back-arrow.svg";

function SideMenu({ collapsed = false }) {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchElements = async () => {
            setLoading(true);
            try {
                const data = await getAllElements();
                if (isMounted) {
                    setElements(Array.isArray(data) ? data : []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error cargando elementos", err);
                    setError("No se pudieron cargar los elementos");
                    setElements([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchElements();
        return () => {
            isMounted = false;
        };
    }, []);

    const formatWattage = (element) => {
        const watt = resolveElementWattage(element);
        return watt ?? "N/A";
    };

    const totalCatalogPower = elements.reduce((acc, element) => {
        return acc + (resolveElementWattage(element) ?? 0);
    }, 0);

    const formatNumber = (value) => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);

    const handleDragStart = (element) => (event) => {
        event.dataTransfer.setData("application/json", JSON.stringify(element));
        event.dataTransfer.dropEffect = "copy";
    };

    return (
        <div className={`side-menu${collapsed ? " collapsed" : ""}`}>
            <header className="side-menu-header">
                <div className="side-menu-header-row">
                    <p className="side-menu-eyebrow">Catálogo de componentes</p>
                    <Link to="/projects" className="back-button">
                        <img src={backBtn} alt="Volver a proyectos" width={24} height={24} />
                    </Link>
                </div>
                <h2>Arrastra, suelta y conecta</h2>
                <p>
                    Selecciona elementos del catálogo y arrástralos al lienzo para construir tu
                    microred. Cada tarjeta incluye el consumo estimado para ayudarte a balancear
                    la potencia.
                </p>
                <div className="side-menu-meta">
                    <span>{formatNumber(elements.length)} elementos</span>
                    <span>{formatNumber(totalCatalogPower)} W en catálogo</span>
                </div>
            </header>

            <div id="elements-list" className="elements-list">
                {loading && <p className="elements-status">Cargando elementos...</p>}
                {!loading && error && (
                    <p className="elements-status error">{error}</p>
                )}
                {!loading && !error && elements.length === 0 && (
                    <p className="elements-status">No hay elementos disponibles.</p>
                )}
                {!loading && !error && elements.map((element) => (
                    <CardPanel
                        key={element.id ?? element.name}
                        id={element.id}
                        model={element.name ?? "Elemento sin nombre"}
                        wattage={formatWattage(element)}
                        draggable
                        onDragStart={handleDragStart(element)}
                    />
                ))}
            </div>
        </div>
    );
}

export default SideMenu;
