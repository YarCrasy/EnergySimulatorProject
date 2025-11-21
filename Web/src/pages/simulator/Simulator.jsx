import "./Simulator.css";

import SideMenu from "./sideMenu/SideMenu";
import DiagramWorkspace from "./workspace/DiagramWorkspace";

function Simulator() {
    return (
        <main className="simulator-page">
            <SideMenu />
            <div className="simulator-space">
                <DiagramWorkspace />
            </div>
        </main>
    );
}

export default Simulator;
