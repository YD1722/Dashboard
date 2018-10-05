L.Control.Layers.prototype._addItem = function (obj) {
    var label = document.createElement('label'),
        input,
        checked = this._map.hasLayer(obj.layer);

    if (obj.overlay) {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'leaflet-control-layers-selector';
        input.defaultChecked = checked;
    }
    else {
        input = this._createRadioElement('leaflet-base-layers', checked);
    }

    input.layerId = L.stamp(obj.layer);

    L.DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    label.appendChild(input);
    label.appendChild(name);
    label.className = obj.overlay ? "checkbox" : "radio";
    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(label);

    return label;
}
var m = L.map("map", {
    zoomControl: false
});
m.doubleClickZoom.disable();
if (!location.hash) {
    m.setView([6.5626371894890445 , 80.38146972656251], 6);
}
m.addHash();
var url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
// var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoieWQxNzIyIiwiYSI6ImNqbWdsbGxobjAwZ28zcXBwNXF6NW41MXQifQ.T7idI6Z2juWuemmSAjuL6w'


var optionsObject = {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}

var mq = L.tileLayer(url, optionsObject);
var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
})
mq.addTo(m);
var lc = L.control.layers({
    // "Stamen Watercolor": watercolor,
    "Stamen Toner": mq
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

var isDbClicked = false;
var selectedLat = null;
var selectedLng = null;

m.on('dblclick', function (e) {

    isDbClicked = true;
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;

    selectedLat = lat;
    selectedLng = lng
    
    $('#selectedCoord span').html(selectedLat+" , "+selectedLng);


});

function checkStatus(response) {
    if (!response.ok) {   // (response.status < 200 || response.status > 300)
        const error = new Error(response.statusText || response.status);
        error.response = response;
        throw error;
    }
    return response;
}

function parseJSON(response) {
    return response.json();
}

function onRequestSuccess(response) {
    console.log(response);

}

function onRequestFailure(error) {
    console.log(error)
}

var startDay = null
var endDay = null
$(function () {

    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);
    startDay = start.toDate();
    endDay = end.toDate();


});

function getWeatherData() {
    if (isDbClicked == true) {
        console.log("true");
        getRangeWeatherData()
    }
}

function getRangeWeatherData() {
    getDaily(startDay);
}

function getDaily(date) {

    api_keys = ['b03f37e6864d6c346701ce46fdd4550d',
        '0c26bd35772366ab9b8e15fe4a121c1c',
        '77418266a86e6c68c8fcdf2b12ea1856',
        '09258809c8a908bbf00d4a16a4a7a81c',
        'f9ef9e89c22946cd6248855ed4f452f8',
        '0112c9f14f60b7b881d68e5dfd489485',
        '22f0399662fb3b4ac1c6a08b46fcc7b5',
        'b78b6e3c3d3aa12394bea764a28be97d',
        'a0ba129df835c5bafdddda535211b944',
        '2c92133d99c330bc16a00aab5b688ce5',
        '62e3c0802e57945aff5078472367a33c',
        'bfe39dc601d2c3fe5ce3bd172bb195d8',
        '234c71f721b0e84ded96906c645509cf',
        '41ae8bee39d644014b342e5232349046',
        '8eab7a876af2f55cd5b2a9921b79e4a1',
    ]
    let api_url = "https://api.darksky.net/forecast/" + api_keys[1] + "/" + selectedLat + "," + selectedLng + "," + Math.round(date.getTime() / 1000);


    // get darksky api data
    $.ajax({
        url: api_url,
        dataType: "jsonp",
        success: function (weatherData) {
            //icon information (explained after)
            var icon = weatherData.currently.icon;
            //weather description
            var description = weatherData.currently.summary;
            //change background image
            //temperature
            var temperature = weatherData.currently.temperature;
            console.log(weatherData)
        }
    });

}

