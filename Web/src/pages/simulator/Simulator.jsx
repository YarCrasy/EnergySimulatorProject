import "./Simulator.css";
import { useState } from "react";
import { useParams, useLocation } from 'react-router-dom';

import SideMenu from "./sideMenu/SideMenu";
import DiagramWorkspace from "./workspace/DiagramWorkspace";
import toolBoxIcon from "../../assets/tool-box.svg";

function Simulator() {
    const { projectId } = useParams();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    
    const resolvedProjectId = projectId ?? location?.state?.projectId ?? null;

    return (
        <main className="simulator-page">
            
            <button
                type="button"
                className={`menu-toggle-button${collapsed ? " collapsed" : ""}`}
                onClick={() => setCollapsed(!collapsed)}
                aria-pressed={collapsed}
                aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}
            >
                <img src={toolBoxIcon} alt="Toggle Menu" width={30} />
            </button>

            <SideMenu projectId={resolvedProjectId} collapsed={collapsed} />
            <div className="simulator-space">
                <DiagramWorkspace projectId={resolvedProjectId} />
            </div>
        </main>
    );

    // return(
    //     <main className="simulator-page">
    //         <h1>Estamos trabajando en el simulador</h1>
    //         <h2>disculpen las molestias</h2>
    //     </main>
    // );
}

export default Simulator;
