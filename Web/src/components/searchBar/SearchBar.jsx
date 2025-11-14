import "./SearchBar.css";

function SearchBar() {
    return (
        <div className="search-bar">
            <div style={{ width: "100%", flexWrap: "nowrap", display: "flex", alignItems: "center" }}>
                <button>menu</button>
                <input className="search-input" type="text" placeholder="Buscar..." />
            </div>
            <button>buscar</button>
        </div>
    );
}

export default SearchBar;
