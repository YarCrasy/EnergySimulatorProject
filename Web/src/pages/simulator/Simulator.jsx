import "./Simulator.css";

import { SearchBar } from "../../components/searchBar/SearchBar";
import { HeadingButton } from "../../components/searchBar/SearchBar";
import backBtn from "../../assets/back-arrow.svg";
import { Link } from "react-router-dom";
import UserProfile from "../../components/userProfile/UserProfile";

function Simulator() {
    return (
        <main className="simulator-page">
            <div className="side-menu">
                {/* Aquí va la lista de elementos */}
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
                <div id="elements-list">
                    {/* Lista de elementos del simulador */}
                </div>
            </div>
            <div className="simulator-viewer">
                {/* Aquí va el visor del simulador */}
            </div>
        </main>
    );
}

export default Simulator;
