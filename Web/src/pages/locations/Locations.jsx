import "./Locations";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Mapa() {
  return (
    <div className="map-container">
    <MapContainer
      center={[27.915, -15.5713]}
      zoom={10}
      style={{ height: "89vh", width: "100%" }}
    >
      <TileLayer  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />

      <Marker position={[27.7405, -15.597]}>
        <Popup>Maspalomas – Zona de máxima radiación solar</Popup>
      </Marker>

      <Marker position={[27.915, -15.5713]}>
        <Popup>San Bartolomé de Tirajana – Muy alta exposición solar</Popup>
      </Marker>

      <Marker position={[27.9894, -15.4124]}>
        <Popup>Telde – Zona ideal para instalaciones solares</Popup>
      </Marker>

      <Marker position={[27.8487, -15.4463]}>
        <Popup>Vecindario – Amplias zonas soleadas</Popup>
      </Marker>

      <Marker position={[27.7893, -15.71]}>
        <Popup>Puerto Rico – Alta radiación todo el año</Popup>
      </Marker>

      <Marker position={[27.8847, -15.7259]}>
        <Popup>Mogán – Clima muy estable y soleado</Popup>
      </Marker>
      <Marker position={[27.764, -15.6862]}>
        <Popup>Arguineguín – Uno de los lugares más soleados</Popup>
      </Marker>
    </MapContainer>
    </div>
  );
}
