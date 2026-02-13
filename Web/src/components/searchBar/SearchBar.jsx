import "./SearchBar.css";

import menuBtn from "@svg/burger-menu.svg";
import searchIcon from "@svg/search-icon.svg";
import backIcon from "@svg/back-arrow.svg";

import { useState } from "react";

const HeadingButton = {
    NONE: 1,
    FILTER: 2,
    BACK: 3
};

function SearchBar({ onSearch, headingButton = HeadingButton.NONE, placeholder = "Buscar...", filterOptions = [] }) {

    return (
        <div className="search-bar">
            <div className="search-inner" style={{ width: "100%" }}>
                {headingButton === HeadingButton.FILTER && <FilterList filterOptions={filterOptions} />}
                {headingButton === HeadingButton.BACK && <BackBtn />}

                <input className="search-input" type="text" placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch();
                        }
                    }}
                />
            </div>
            <button
                type="button" aria-label="Buscar" className="search-button"
                onClick={onSearch}>
                <img src={searchIcon} alt="Buscar" />
            </button>

        </div>
    );
}

function FilterList({ filterOptions }) {
    const [filterClicked, setFilterClicked] = useState(false);
    return (
        <div className="menu-wrapper">
            <button
                type="button" aria-label="Abrir menú" className="menu-button"
                onClick={() => setFilterClicked(!filterClicked)}>
                <img src={menuBtn} alt="menu" />
            </button>
            {filterClicked && (
                <div className="filter-list">
                    <ul>
                        {filterOptions.map((option, index) => (
                            <li key={index}>{option}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function BackBtn() {
    return (
        <button type="button" aria-label="Volver" className="back-button" onClick={() => window.history.back()}>
            <img src={backIcon} alt="Volver" />
        </ button>
    );
}

export { SearchBar, HeadingButton };
