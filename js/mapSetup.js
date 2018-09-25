// var mymap = L.map('mapid').setView([6.7056, 80.3847], 13);

//         L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//             maxZoom: 18,
//             attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//                 '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//                 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//             id: 'mapbox.streets'
//         }).addTo(mymap);

// L.Control.Layers.prototype._addItem = function (obj) {
//     var label = document.createElement('label'),
//         input,
//         checked = this._map.hasLayer(obj.layer);

//     if (obj.overlay) {
//         input = document.createElement('input');
//         input.type = 'checkbox';
//         input.className = 'leaflet-control-layers-selector';
//         input.defaultChecked = checked;
//     }
//     else {
//         input = this._createRadioElement('leaflet-base-layers', checked);
//     }

//     input.layerId = L.stamp(obj.layer);

//     L.DomEvent.on(input, 'click', this._onInputClick, this);

//     var name = document.createElement('span');
//     name.innerHTML = ' ' + obj.name;

//     label.appendChild(input);
//     label.appendChild(name);
//     label.className = obj.overlay ? "checkbox" : "radio";
//     var container = obj.overlay ? this._overlaysList : this._baseLayersList;
//     container.appendChild(label);

//     return label;
// }
var m = L.map("map", {
    zoomControl: false,
    // layers: [grayscale, geo]
});
// http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
// var grayscale =

var watercolor = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(m)
// var geo = L.geoJson({ features: [] }, {
//     onEachFeature: function popUp(f, l) {
//         var out = [];
//         if (f.properties) {
//             for (var key in f.properties) {
//                 out.push(key + ": " + f.properties[key]);
//             }
//             l.bindPopup(out.join("<br />"));
//         }
//     }
// })
// var base = 'files/Landslides.zip';
// shp(base).then(function (data) {
//     console.log(data);
//     geo.addData(data);
// });



if (!location.hash) {
    m.setView([6.7056, 80.3847], 13);
}
m.addHash();

// var baseMaps = {
//     "Grayscale": grayscale,
// };

// var overlayMaps = {
//     "Geo": geo
// };

// L.control.layers(baseMaps, overlayMaps).addTo(m);

var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoieWQxNzIyIiwiYSI6ImNqbWdsbGxobjAwZ28zcXBwNXF6NW41MXQifQ.T7idI6Z2juWuemmSAjuL6w'

var optionsObject = {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}

var sat = L.tileLayer(url, optionsObject);
sat.addTo(m)

// var sat = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9.html?fresh=true&title=true&access_token=pk.eyJ1IjoieWQxNzIyIiwiYSI6ImNqbWdsbGxobjAwZ28zcXBwNXF6NW41MXQifQ.T7idI6Z2juWuemmSAjuL6w#0.0/0.000000/0.000000/0', {
//     attribution: '..'
// })
// sat.addTo(m)
// mq.addTo(m);




var lc = L.control.layers({
    "baseLayer": watercolor,
    "satellite": sat
}).addTo(m);
//make the map
var options = {
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                if (k === '__color__') {
                    return;
                }
                return k + ": " + feature.properties[k];
            }).join("<br />"), {
                    maxHeight: 200
                });
        }
    },
    style: function (feature) {
        return {
            opacity: 1,
            fillOpacity: 0.7,
            radius: 6,
            color: feature.properties.__color__
        }
    },
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            opacity: 1,
            fillOpacity: 0.7,
            color: feature.properties.__color__
        });
    }
};