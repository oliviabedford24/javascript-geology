const LINK = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getColor(depth) {
    if (depth > 50) {
        return "purple";
    }
    if (depth > 40) {
        return "blue";
    }
    if (depth > 30 ) {
        return "green";
    }
    if (depth > 20) {
        return "yellow";
    }
    if (depth > 1) {
        return "orange";
    }
    return "red";
};

function getRadius(magnitude) {
    if (magnitude ===0) {
        return 1;
    }
    return magnitude * 4;
};

let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(LINK).then(function(data) {
    function circleMarker(feature, latlng) {
        return L.circleMarker(latlng);
    }


    function styleInfo(feature){
        let depth = feature.geometry.coordinates[2];
        let style = {
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: getColor(depth),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
        return style;
    }


    function popupMaker(feature, layer) {
        let mag = feature.properties.mag;
        let place = feature.properties.place;
        let html = `Magnitude: ${mag}<br>Place: ${place}`;
        layer.bindPopup(html);
    }


    L.geoJSON(data, {
        pointToLayer: circleMarker,
        style: styleInfo,
        onEachFeature: popupMaker
    }).addTo(myMap);
});

