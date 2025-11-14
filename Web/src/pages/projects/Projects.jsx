import "./Projects.css";

import SearchBar from "../../components/searchBar/SearchBar";

function Projects() {
    return (
        <header>
            <SearchBar withFilters={true} />
            <button>
                Login
            </button>
        </header>
    );
}

export default Projects;
