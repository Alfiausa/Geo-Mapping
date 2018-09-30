console.log("js has loaded");

var access_token="pk.eyJ1IjoiYWxmaWFub3ZhIiwiYSI6ImNqbGVldW1jdDBsZnYzdm85bWo5cWVqcGgifQ.9eWmHkT4EU6UeDe7tGjreQ"

var mymap = L.map('mapid').setView([51.505, -0.09], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: access_token
}).addTo(mymap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", function(data) {
    console.log(data.features[0].geometry.coordinates[0]);

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5

        };
    }

    function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#ea2c2c";
        case magnitude > 4:
            return "#ea822c";
        case magnitude > 3:
            return "#ee9c00";
        case magnitude > 2:
            return "#eecc00";
        case magnitude > 1:
            return "#d4ee00";
        default:
            return "#98ee00";
          }
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }
        


    //add circle to map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature. properties.place);
        }
    }).addTo(mymap);

    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0,1,2,3,4,5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
          ];  

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "></i>" + 
            grades[i] + (grades[i+1] ? "&ndash;" + grades[i + 1] + "<br>"  : "+");
    
            
        }
        return div;

    } 
    legend.addTo(mymap)
});
