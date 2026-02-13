import "./Simulator.css";
import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import SideMenu from "./sideMenu/SideMenu";
import DiagramWorkspace from "./workspace/DiagramWorkspace";
import toolBoxIcon from "@svg/tool-box.svg";

function Simulator() {
    const { projectId } = useParams();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const resolvedProjectId = projectId ?? location?.state?.projectId ?? null;

    return (
        <main className="simulator-page">
            <section className="simulator-shell">
                <SideMenu projectId={resolvedProjectId} collapsed={collapsed} />
                <div className="simulator-workbench">
                    <DiagramWorkspace projectId={resolvedProjectId} />
                </div>
            </section>
            <button
                type="button"
                className="simulator-toggle"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-pressed={collapsed}
            >
                <img src={toolBoxIcon} alt="Icono del catálogo" width={20} height={20} />
            </button>
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
