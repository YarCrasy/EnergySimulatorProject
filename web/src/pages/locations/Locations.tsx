import { useEffect, useMemo, useState } from "react";
import "./Locations.css";
import Spiner from "../../components/spiner/Spiner";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { latLngBounds } from "leaflet";

type MapCoords = [number, number];

const solarSpots = [
  {
    name: "Maspalomas",
    description: "Zona turística con irradiancia elevada ideal para cubiertas hoteleras.",
    coords: [27.7405, -15.597] as MapCoords,
    irradiance: "6.1 kWh/m²",
  },
  {
    name: "San Bartolomé de Tirajana",
    description: "Muy alta exposición solar y baja nubosidad anual.",
    coords: [27.915, -15.5713] as MapCoords,
    irradiance: "5.9 kWh/m²",
  },
  {
    name: "Telde",
    description: "Zona industrial con disponibilidad para techos fotovoltaicos.",
    coords: [27.9894, -15.4124] as MapCoords,
    irradiance: "5.6 kWh/m²",
  },
  {
    name: "Vecindario",
    description: "Amplias zonas soleadas y buena infraestructura eléctrica.",
    coords: [27.8487, -15.4463] as MapCoords,
    irradiance: "5.7 kWh/m²",
  },
  {
    name: "Puerto Rico",
    description: "Alta radiación durante todo el año, óptimo para microredes.",
    coords: [27.7893, -15.71] as MapCoords,
    irradiance: "6.0 kWh/m²",
  },
  {
    name: "Mogán",
    description: "Clima estable y soleado con baja nubosidad.",
    coords: [27.8847, -15.7259] as MapCoords,
    irradiance: "5.8 kWh/m²",
  },
  {
    name: "Arguineguín",
    description: "Uno de los puntos más soleados para autoconsumo industrial.",
    coords: [27.764, -15.6862] as MapCoords,
    irradiance: "6.2 kWh/m²",
  },
];

function MapViewportController({ bounds }: { bounds: ReturnType<typeof latLngBounds> }) {
  const map = useMap();

  useEffect(() => {
    const syncMapViewport = () => {
      map.invalidateSize();
      map.fitBounds(bounds, {
        padding: [32, 32],
        maxZoom: 10,
      });
    };

    syncMapViewport();

    window.addEventListener("resize", syncMapViewport);
    window.addEventListener("orientationchange", syncMapViewport);

    return () => {
      window.removeEventListener("resize", syncMapViewport);
      window.removeEventListener("orientationchange", syncMapViewport);
    };
  }, [bounds, map]);

  return null;
}

export default function Locations() {
  const [loading, setLoading] = useState(true);
  const islandBounds = useMemo(
    () => latLngBounds(solarSpots.map((spot) => spot.coords)),
    []
  );

  return (
    <main className="locations-page">
      <section className="locations-panel">
        <h1>Localiza zonas de alta irradiancia para tu próximo proyecto</h1>
        <p className="locations-lede">
          Los mapas se actualizan con datos satelitales y climatológicos para ayudarte a priorizar cubiertas,
          comunidades energéticas o plantas híbridas.
        </p>
        <div className="locations-stats">
          <article>
            <span>+720</span>
            <p>Horas de sol útiles</p>
          </article>
          <article>
            <span>5.9 kWh/m²</span>
            <p>Irradiancia media</p>
          </article>
          <article>
            <span>12</span>
            <p>Capas climáticas</p>
          </article>
        </div>
        <div className="locations-list">
          {solarSpots.map((spot) => (
            <article key={spot.name}>
              <div>
                <h3>{spot.name}</h3>
                <p>{spot.description}</p>
              </div>
              <span>{spot.irradiance}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="locations-map">
        <div className="map-wrapper">
          {loading && <Spiner text="Cargando mapa..." />}
          <MapContainer
            className="leaflet-map"
            whenReady={() => setLoading(false)}
            bounds={islandBounds}
            boundsOptions={{ padding: [32, 32] }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            />
            <MapViewportController bounds={islandBounds} />
            {solarSpots.map((spot) => (
              <Marker key={spot.name} position={spot.coords}>
                <Popup>
                  <strong>{spot.name}</strong>
                  <br />
                  {spot.description}
                  <br />
                  Irradiancia: {spot.irradiance}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </main>
  );
}
