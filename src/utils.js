export function genRandomPositions(numPositions) {
  // Define the range of latitudes and longitudes
  const minLat = -90;
  const maxLat = 90;
  const minLon = -180;
  const maxLon = 180;

  // Generate the random points
  const points = Array.from({ length: numPositions }, () => ({
    lat: Math.random() * (maxLat - minLat) + minLat,
    lon: Math.random() * (maxLon - minLon) + minLon,
    color: genRandomHexColor()
  }));// Define the range of latitudes and longitudes

  return points;
}

export function genRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}