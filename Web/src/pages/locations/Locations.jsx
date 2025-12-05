import React, { useState } from "react";
import "./Locations.css";
import Spiner from "../../components/spiner/Spiner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import iconMarker from "../../assets/marker.png"; // importa la imagen
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: iconMarker,   // la imagen importada
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


export default function Mapa() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="map-container" style={{ position: "relative" }}>
      {loading && <Spiner text="Cargando mapa..." />}
      <MapContainer
        center={[27.915, -15.5713]}
        zoom={10}
        style={{ height: "89vh", width: "100%" }}
        whenReady={() => setLoading(false)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />

        <Marker position={[27.7405, -15.597]} icon={DefaultIcon}>
          <Popup>Maspalomas – Zona de máxima radiación solar</Popup>
        </Marker>
        <Marker position={[27.915, -15.5713]} icon={DefaultIcon}>
          <Popup>San Bartolomé de Tirajana – Muy alta exposición solar</Popup>
        </Marker>
        <Marker position={[27.9894, -15.4124]} icon={DefaultIcon}>
          <Popup>Telde – Zona ideal para instalaciones solares</Popup>
        </Marker>
        <Marker position={[27.8487, -15.4463]} icon={DefaultIcon}>
          <Popup>Vecindario – Amplias zonas soleadas</Popup>
        </Marker>
        <Marker position={[27.7893, -15.71]} icon={DefaultIcon}>
          <Popup>Puerto Rico – Alta radiación todo el año</Popup>
        </Marker>
        <Marker position={[27.8847, -15.7259]} icon={DefaultIcon}>
          <Popup>Mogán – Clima muy estable y soleado</Popup>
        </Marker>
        <Marker position={[27.764, -15.6862]} icon={DefaultIcon}>
          <Popup>Arguineguín – Uno de los lugares más soleados</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
