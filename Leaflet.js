var accessToken = "pk.eyJ1IjoiYWFiZGVsbWFsZWsiLCJhIjoiY2pwdWV2MTZ0MGZ6NjN4cXp1aGF2OXFoNiJ9.VKW2J7nNXHTuOWGwjbHGbw";
var mymap = L.map('mapid').setView([44,-103],3);
var results;
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url).then(function(data){

circles(data);

})


function circles(data){

    // var magnitude=[];
    for (var i=0;i < data.features.length;i++){
    var lat = data.features[i].geometry.coordinates[0];
    console.log(lat);
    var long = data.features[i].geometry.coordinates[1];
    console.log(long);
    var mag = data.features[i].properties.mag;
    console.log(mag);
    var place = data.features[i].properties.place;

    var circle = L.circle([long,lat], {
        color: getColor(mag),
        fillColor: getColor(mag),
        fillOpacity: 1,
        radius: mag*20000
    }).addTo(mymap);

    circle.bindPopup(`${place}<br>${mag} magnitude`);

    }


results = data;
}

function getColor(d) {
    return d > 9? '#800026' :
           d > 5  ? '#BD0026' :
           d > 4  ? '#E31A1C' :
           d > 3  ? '#FC4E2A' :
           d > 2   ? '#FD8D3C' :
           d > 1   ? '#FEB24C' :
           d > 0   ? '#FED976' :
                      '#FFEDA0';
}

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    // accessToken: accessToken,
    // radius:1000*data.features[i].properties.mag,
    }).addTo(mymap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 9, 10],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '');
    }

    return div;
};

legend.addTo(mymap);