var typeahead = require('typeahead.js');
var $ = require('jquery');
var Bloodhound = require('bloodhound-js');
var L = require('leaflet');
var Proj = require('proj4');
var proj4leaflet = require('proj4leaflet');
var Hash = require('leaflet-hash');
var WKT = require('terraformer-wkt-parser');

// MAP
// ////////////////////////////////////
// DEFINE RD NEW
var RDnew = new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs',
    {
        resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210],
        bounds: L.bounds([-285401.92, 22598.08], [595401.9199999999, 903401.9199999999]),
        origin: [-285401.92, 22598.08]
    }
);

// INIT MAP
var map = L.map("map", {
    center: [52.07, 4.306],
    zoom: 6,
    crs: RDnew
});

// HASH in URL
var hash = new L.Hash(map);

// TMS van PDOK 
var pdokachtergrondkaart = new L.TileLayer('https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartwater/EPSG:28992/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 13,
    tms: true,
    attribution: 'Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
});
pdokachtergrondkaart.addTo(map);

// SEARCH BAR
////////////////////////////////////
var searchdata = {};
function enableTypeahead() {
    $('#ttinput .typeahead').typeahead({
        hint: false,
        highlight: true,
        minLength: 2
    },
    {
        name: 'PDOK',
        displayKey: 'value',
        display: 'value',
        limit: 5,
        source: searchdata.bloodhoundengine,
        templates: {
            empty: [
                "<div class='noitems'>",
                'Niets gevonden',
                '</div>'
            ].join('\n')
        }
    });
};
var searchInputListeners = function () {
    $('#ttinput .typeahead').on('typeahead:select', function (ev, suggestion) {
        getCoordinates(suggestion);
    });
    $('#ttinput .typeahead').on('typeahead:autocomplete', function (ev, suggestion) {
        getCoordinates(suggestion);
    });
};
// SUGGESTION API
function enableBloodhound() {
    searchdata.bloodhoundengine = new Bloodhound({
        datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.value); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: 'https://geodata.nationaalgeoregister.nl/locatieserver/suggest?rows=10&fq=type:woonplaats&q=%QUERY',
            wildcard: '%QUERY',
            transform: function (response) {
                return $.map(response.response.docs, function (item) {
                    console.log(response);
                    return {
                        value: item.weergavenaam,
                        id: item.id
                    };
                });
            }
        }
    });
    searchdata.bloodhoundengine.initialize();
};
var url = '';
// GET COORDINATES OF CHOSEN LOCATION API
function getCoordinates(suggestion) {
    var plaats = suggestion.id;
    url = 'https://geodata.nationaalgeoregister.nl/locatieserver/lookup?fl=*&id=' + plaats;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            getTarget(myArr);
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

// GET TARGET
function getTarget(plaats) {
    var locatieString = plaats.response.docs[0].centroide_ll;
    var target = L.latLng(Number(locatieString.substring(17, locatieString.length - 1)), Number(locatieString.substring(6, 16)));
    // recenterMap(target);
    drawPolygon(plaats.response.docs[0]);
    showText(plaats.response.docs[0]);
};

// RECENTER MAP ON CHOSEN LOCATION
function recenterMap(target) {
    console.log(target)
    map.setView(target,8);
};

// ADD GEOJSON LAYER TO MAP AND ZOOM
function drawPolygon(plaats){
    var data = WKT.parse(plaats.geometrie_ll);
    var geojsonlayer = L.geoJSON(data).addTo(map);
    map.fitBounds(geojsonlayer.getBounds());
};

// START SEARCH
function initSearch() {
    enableBloodhound();
    enableTypeahead();
    searchInputListeners();
};
initSearch();


// SHOW text
function showText(place) {
    delete place.geometrie_ll; 
    delete place.geometrie_rd;
    delete place.suggest;
    var str = JSON.stringify(place);
    regeStr = '', // A EMPTY STRING TO EVENTUALLY HOLD THE FORMATTED STRINGIFIED OBJECT
        f = {
            brace: 0
        }; // AN OBJECT FOR TRACKING INCREMENTS/DECREMENTS,
           // IN PARTICULAR CURLY BRACES (OTHER PROPERTIES COULD BE ADDED)

    regeStr = str.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
        var rtnFn = function () {
            return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
        },
            rtnStr = 0;
        if (p1.lastIndexOf('{') === (p1.length - 1)) {
            rtnStr = rtnFn();
            f['brace'] += 1;
        } else if (p1.indexOf('}') === 0) {
            f['brace'] -= 1;
            rtnStr = rtnFn();
        } else {
            rtnStr = rtnFn();
        }
        return rtnStr;
    });
    document.getElementById('flextext').innerHTML = "<a href=" + url + ">" + url + "</a> </br>" + "</br><h1>Response:</h1></br>" + regeStr  ;

}
