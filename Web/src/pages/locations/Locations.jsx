import React, { useState } from "react";
import "./Locations.css";
import Spiner from "../../components/spiner/Spiner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import iconMarker from "@png/marker.png";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: iconMarker,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const solarSpots = [
  {
    name: "Maspalomas",
    description: "Zona turística con irradiancia elevada ideal para cubiertas hoteleras.",
    coords: [27.7405, -15.597],
    irradiance: "6.1 kWh/m²",
  },
  {
    name: "San Bartolomé de Tirajana",
    description: "Muy alta exposición solar y baja nubosidad anual.",
    coords: [27.915, -15.5713],
    irradiance: "5.9 kWh/m²",
  },
  {
    name: "Telde",
    description: "Zona industrial con disponibilidad para techos fotovoltaicos.",
    coords: [27.9894, -15.4124],
    irradiance: "5.6 kWh/m²",
  },
  {
    name: "Vecindario",
    description: "Amplias zonas soleadas y buena infraestructura eléctrica.",
    coords: [27.8487, -15.4463],
    irradiance: "5.7 kWh/m²",
  },
  {
    name: "Puerto Rico",
    description: "Alta radiación durante todo el año, óptimo para microredes.",
    coords: [27.7893, -15.71],
    irradiance: "6.0 kWh/m²",
  },
  {
    name: "Mogán",
    description: "Clima estable y soleado con baja nubosidad.",
    coords: [27.8847, -15.7259],
    irradiance: "5.8 kWh/m²",
  },
  {
    name: "Arguineguín",
    description: "Uno de los puntos más soleados para autoconsumo industrial.",
    coords: [27.764, -15.6862],
    irradiance: "6.2 kWh/m²",
  },
];

export default function Locations() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="locations-page">
      <section className="locations-panel">
        <p className="locations-eyebrow">Atlas solar</p>
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
            center={[27.915, -15.5713]}
            zoom={10}
            className="leaflet-map"
            whenReady={() => setLoading(false)}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            />
            {solarSpots.map((spot) => (
              <Marker key={spot.name} position={spot.coords} icon={DefaultIcon}>
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
