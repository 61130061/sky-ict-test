import { useEffect, useRef, useState } from "react";
import { renderToString } from 'react-dom/server';

import { genRandomPositions } from './utils';

function App() {
  const [positions, setPositions] = useState(genRandomPositions(300000));
  const [showPos, setShowPos] = useState([]);
  const map = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (map.current) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      const markers = L.markerClusterGroup();

      showPos.forEach((pos) => {
        const marker = L.marker([pos.lat, pos.lon], {
          icon: L.divIcon({
            html: renderToString(
              <div className="marker" style={{ backgroundColor: pos.color }} />
            ),
            className: "marker-container",
          }),
        });
        markers.addLayer(marker);
      });

      map.current.addLayer(markers);
    }
  }, [showPos, map.current]);

  useEffect(() => {
    if (map.current) {
      function handleMoveEnd() {
        const bounds = map.current.getBounds();
        const filteredPos = positions.filter((pos) => {
          const latLng = L.latLng(pos.lat, pos.lon);
          return bounds.contains(latLng);
        });
        setShowPos([...filteredPos]);
      }

      handleMoveEnd();

      map.current.on("moveend", handleMoveEnd);

      return () => {
        map.current.off("moveend", handleMoveEnd);
      };
    }
  }, [positions]);

  useEffect(() => {
    if (map.current) {
      map.current.remove();
    }
    if (mapRef.current) {
      map.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.current);

      const interval = setInterval(() => {
        setPositions([...genRandomPositions(300000)]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ height: "100vh" }} />
    </>
  );
}

export default App;
