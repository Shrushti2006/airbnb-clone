// public/js/map.js

const mapDiv = document.getElementById('map');

if (mapDiv) {
  const lat = parseFloat(mapDiv.dataset.lat);
  const lon = parseFloat(mapDiv.dataset.lon);
  const title = mapDiv.dataset.title;
  const location = mapDiv.dataset.location;

  // Base layers
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap contributors'
  });

  const carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors'
  });
  var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});


  // Initialize map with default layer (street)
  const map = L.map('map', {
    center: [lat, lon],
    zoom: 13,
    layers: [street] // default layer
  });

  // Layer control
  const baseMaps = {
    "Street": street,
    "Topographic": topo,
    "Carto Light": carto,
     "OpenStreetMap.HOT": osmHOT
  };

  L.control.layers(baseMaps).addTo(map);

  // Red marker for your listing
   const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  // Add marker with popup
  L.marker([lat, lon], { icon: redIcon })
    .addTo(map)
    .bindPopup(`<b>${title}</b><br>${location}<br><i>Fun place for holiday</i>`)
    .openPopup();
}