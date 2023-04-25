import { useEffect, useRef, useState } from "react";
import { renderToString } from 'react-dom/server';

import { genRandomPositions } from './utils';

function App() {
  const [positions, setPositions] = useState(genRandomPositions(300000));
  const map = useRef(null);
  const mapRef = useRef(null);
  const isZoom = useRef(false);

  function clearLayers() {
    if (map.current) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
    }
  }

  function updateMap (newPos) {
    if (map.current && !isZoom.current) {
      clearLayers();

      const markers = L.markerClusterGroup({
        animate: false,
        showCoverageOnHover: false,
        disableClusteringAtZoom: 10,
        maxClusterRadius: 200,
      });

      const bounds = map.current.getBounds();
      var filteredPos;
      if (newPos) {
        filteredPos = newPos.filter((pos) => {
          const latLng = L.latLng(pos.lat, pos.lon);
          return bounds.contains(latLng);
        });
      } else {
        filteredPos = positions.filter((pos) => {
          const latLng = L.latLng(pos.lat, pos.lon);
          return bounds.contains(latLng);
        });
      }

      filteredPos.forEach((pos) => {
        const marker = L.marker([pos.lat, pos.lon], {
          icon: L.divIcon({
            html: renderToString(
              <div>
                <div
                  className="heartbeat"
                  style={{ backgroundColor: pos.color }}
                />
                <div className="dot" style={{ backgroundColor: pos.color }} />
              </div>
            ),
            className: "marker-container",
          }),
        });
        markers.addLayer(marker);
      });

      map.current.addLayer(markers);
    }
  }

  useEffect(() => {
    if (map.current) {
      map.current.remove();
    }
    if (mapRef.current) {
      map.current = L.map(mapRef.current).setView([13.736717, 100.523186], 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 15,
        minZoom: 4,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.current);

      updateMap();

      map.current.on("zoomstart", () => isZoom.current = true);
      map.current.on("zoomend", () => isZoom.current = false);
      map.current.on("moveend", () => updateMap());

      const interval = setInterval(() => {
        const newPos = genRandomPositions(300000);
        setPositions(newPos);
        updateMap(newPos);
      }, 1000);

      return () => {
        clearInterval(interval);
        map.current.off("moveend");
        map.current.off("zoomstart");
        map.current.off("zoomend");
      }
    }
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ height: "100vh" }} />
    </>
  );
}

export default App;
