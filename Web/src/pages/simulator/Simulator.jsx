import "./Simulator.css";

import SideMenu from "./sideMenu/SideMenu";

function Simulator() {

    return (
        <main className="simulator-page">
            <SideMenu />
            <div className="simulator-viewer">
                {/* Aquí va el visor del simulador */}
            </div>
        </main>
    );
}

export default Simulator;
