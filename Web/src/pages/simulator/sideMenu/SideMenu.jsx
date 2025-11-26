import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./SideMenu.css";

import { SearchBar, HeadingButton } from "../../../components/searchBar/SearchBar";
import UserProfile from "../../../components/userProfile/UserProfile";
import CardPanel from "../../../components/cardPanel/CardPanel";
import { getAllElements } from "../../../api/elements";
import backBtn from "../../../assets/back-arrow.svg";

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
        const watt = element?.powerWatt ?? element?.powerConsumption;
        if (typeof watt === "number" && Number.isFinite(watt)) {
            return Math.round(watt * 100) / 100;
        }
        return "N/A";
    };

    const handleDragStart = (element) => (event) => {
        event.dataTransfer.setData("application/json", JSON.stringify(element));
        event.dataTransfer.dropEffect = "copy";
    };

    return (
        <div className={`side-menu${collapsed ? " collapsed" : ""}`}>

            <div className="menu-top-side">
                <div className="bar">
                    <Link to="/projects" className="back-button">
                        <img src={backBtn} alt="Back" width={30} />
                    </Link>
                    <UserProfile />
                </div>
                <SearchBar placeholder="Buscar en el simulador..."
                    headingButton={HeadingButton.FILTER} filterOptions={[]} />
            </div>

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