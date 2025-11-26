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
    // allow projectId from URL param or from navigation state
    const resolvedProjectId = projectId ?? location?.state?.projectId ?? null;

    return (
        <main className="simulator-page">
            
            <button className="menu-toggle-button" onClick={() => setCollapsed(!collapsed)}>
                <img src={toolBoxIcon} alt="Toggle Menu" width={30} />
            </button>

            <SideMenu projectId={resolvedProjectId} collapsed={collapsed} />
            <div className="simulator-space">
                <DiagramWorkspace projectId={resolvedProjectId} />
            </div>
        </main>
    );
}

export default Simulator;
