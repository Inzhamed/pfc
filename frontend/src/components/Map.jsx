import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Liste fictive des défauts
const defauts = [
  {
    id: 1,
    position: [36.7, 3.2], //ajouter le type du default cad joit ou squad ou ssquoid
    type: "Fissure",
    niveau: "Critique",
    date: "2025-05-01",
    statut: "En attente",
    localisation: "Alger - Secteur B",
  },
  {
    id: 2,
    position: [36.71, 3.21],
    type: "Déformation",
    niveau: "Modéré",
    date: "2025-05-02",
    statut: "Réparé",
    localisation: "El Harrach - Zone 3",
  },
  {
    id: 3,
    position: [36.695, 3.195],
    type: "Obstacle",
    niveau: "Mineur",
    date: "2025-05-03",
    statut: "En attente",
    localisation: "Bab Ezzouar - Ligne 1",
  },
];

// Retourne une icône selon le niveau de gravité
function getIconByLevel(niveau) {
  const color =
    niveau === "Critique" ? "red" : niveau === "Modéré" ? "orange" : "green";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export default function Map() {
  return (
    <div className="w-full h-[700px] overflow-hidden rounded-2xl shadow-lg border border-border">
      <MapContainer
        center={[36.7, 3.2]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {defauts.map((d) => (
          <Marker
            key={d.id}
            position={d.position}
            icon={getIconByLevel(d.niveau)}
          >
            <Popup>
              <div className="w-60 rounded-lg bg-white dark:bg-zinc-900 p-4 text-sm text-zinc-800 dark:text-zinc-100 space-y-2 shadow-md">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Défaut #{d.id}
                </div>

                <div>
                  <span className="font-semibold">Type :</span> {d.type}
                </div>

                <div>
                  <span className="font-semibold">Localisation :</span>{" "}
                  {d.localisation}
                </div>

                <div>
                  <span className="font-semibold">Gravité :</span>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${
                        d.niveau === "Critique"
                          ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                          : d.niveau === "Modéré"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-100"
                          : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                      }`}
                  >
                    {d.niveau}
                  </span>
                </div>

                <div>
                  <span className="font-semibold">Date :</span> {d.date}
                </div>

                <div>
                  <span className="font-semibold">Statut :</span> {d.statut}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
