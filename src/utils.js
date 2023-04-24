export function genRandomPositions(numPositions) {
  const positions = [];

  for (let i = 0; i < numPositions; i++) {
    const lat = (Math.random() * 180) - 90;
    const lon = (Math.random() * 360) - 180;
    positions.push({
      lat, 
      lon,
      color: genRandomHexColor()
    });
  }

  return positions;
}

export function genRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}