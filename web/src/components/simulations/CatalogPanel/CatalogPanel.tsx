import { FaSearch } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

import Spinner from "@components/spiner/Spiner";
import type { EnergyElement } from "@models/element";

import { catalogKinds } from "@components/simulations/simulatorConfig";
import type { CatalogKind } from "@components/simulations/simulatorTypes";
import "./CatalogPanel.css";

type CatalogPanelProps = {
  catalogStatus: "loading" | "error" | "ready";
  catalogSearch: string;
  catalogSearchTerm: string;
  selectedCatalogKind: CatalogKind | null;
  catalogModeTitle: string;
  visibleCatalog: EnergyElement[];
  catalogCounts: Record<CatalogKind, number>;
  onCatalogSearchChange: (value: string) => void;
  onSelectCatalogKind: (kind: CatalogKind | null) => void;
  onAddElement: (element: EnergyElement) => void;
};

export function CatalogPanel({
  catalogStatus,
  catalogSearch,
  catalogSearchTerm,
  selectedCatalogKind,
  catalogModeTitle,
  visibleCatalog,
  catalogCounts,
  onCatalogSearchChange,
  onSelectCatalogKind,
  onAddElement,
}: CatalogPanelProps) {
  return (
    <aside className="catalog-panel">
      <header>
        <p className="eyebrow">Catalogo</p>
        <h1>Simulador</h1>
      </header>
      <label className="catalog-search">
        <span>
          <FaSearch aria-hidden="true" />
          Buscar
        </span>
        <input
          type="search"
          value={catalogSearch}
          onChange={(event) => onCatalogSearchChange(event.target.value)}
          placeholder="Nombre, tipo, marca..."
        />
      </label>
      <div className="catalog-list-header">
        {(selectedCatalogKind || catalogSearchTerm) && (
          <button
            type="button"
            onClick={() => {
              onCatalogSearchChange("");
              onSelectCatalogKind(null);
            }}
          >
            <IoChevronBack aria-hidden="true" />
          </button>
        )}
        <strong>{catalogModeTitle}</strong>
      </div>
      <div className="catalog-list">
        {catalogStatus === "loading" && !catalogSearchTerm && !selectedCatalogKind && (
          <Spinner text="Cargando catalogo..." />
        )}

        {catalogStatus === "error" && !catalogSearchTerm && !selectedCatalogKind && (
          <p className="catalog-empty">No se ha podido cargar el catalogo.</p>
        )}

        {catalogStatus === "ready" && !catalogSearchTerm && !selectedCatalogKind && catalogKinds.map(({ kind, label, icon: Icon }) => (
          <button type="button" className="catalog-type-button" key={kind} onClick={() => onSelectCatalogKind(kind)}>
            <Icon aria-hidden="true" />
            <strong>{label}</strong>
            <span>{catalogCounts[kind]} elementos</span>
          </button>
        ))}

        {(catalogSearchTerm || selectedCatalogKind) && visibleCatalog.map((element) => (
          <button type="button" key={String(element.id ?? element.name)} onClick={() => onAddElement(element)}>
            <strong>{element.name ?? "Elemento"}</strong>
            <span>{element.category ?? element.elementType ?? "Catalogo"}</span>
          </button>
        ))}

        {(catalogSearchTerm || selectedCatalogKind) && visibleCatalog.length === 0 && (
          <p className="catalog-empty">No hay elementos que coincidan.</p>
        )}
      </div>
    </aside>
  );
}
