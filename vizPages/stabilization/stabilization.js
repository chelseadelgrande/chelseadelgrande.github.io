L.mapbox.accessToken = 'pk.eyJ1IjoiY2hlbHNlYWRlbGdyYW5kZSIsImEiOiJjazh4aWR3YWsxN3Y1M2dtaDE2YmdydXZ2In0.pwijKELZM0lRR6FzE90T8A';
var map = L.mapbox.map('map')
    .setView([36.518319, 42.575776], 8)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10'));;

var hues = [
    '#fef0d9',
    '#fdcc8a',
    '#fc8d59',
    '#e34a33',
    '#b30000'
    ];

// The names of variables that we'll show in the UI for
// styling. These need to match exactly.
var variables = [
    'PMG0102: % of people perceiving their group in the subdistrict as being marginalized',
    'PMG0103: % of people perceiving other groups in the subdistrict as being marginalized',
    'PMG0201: % of people thinking that having another group in power will not govern them or protect their rights',
    'PMG0202: % of people that recognize other groups have legitimate political grievances',
    'PMG0301: % of people that perceive their local political elites / leaders to be polarizing communities on the basis of identity',
    'PMG0303: % of people who closely or very closely identify with a national identity (i.e, Iraq)',
    'PMG0501: % of people that perceive responsiveness of provincial institutions now as good or very good',
    'PMG0502: % of people that perceive responsiveness of central institutions now as being good or very good',
    'PMG0601: % of people who are ready and willing to compromise with members of other identity groups in their district',
    'SSE0501: % of residents who feel comfortable to move around the town at any time',
]

// Collect the range of each variable over the full set, so
// we know what to color the brightest or darkest.
var ranges = {};
var $select = $('<select id=sel1></select>')
    .appendTo($('#variables'))
    .on('change', function() {
        setVariable($(this).val());
    });
for (var i = 0; i < variables.length; i++) {
    ranges[variables[i]] = { min: Infinity, max: -Infinity };
    // Simultaneously, build the UI for selecting different
    // ranges
    $('<option id=opt2></option>')
        .text(variables[i])
        .attr('value', variables[i])
        .appendTo($select);
}

// Create a layer of state features, and when it's done
// loading, run loadData
var usLayer = L.mapbox.featureLayer('https://raw.githubusercontent.com/chelseadelgrande/stabilizationOvertime_choro/master/REM_Subdistrict_Dissolvex.geojson')
    .on('ready', function () {
        loadData(this.getGeoJSON())
        usLayer.eachLayer(function(layer) {
        layer.bindPopup(layer.feature.properties.Eth_Sub);
        });
    }).addTo(map);

// Grab the spreadsheet of data as JSON. If you have CSV
// data, you should convert it to JSON with
// http://shancarter.github.io/mr-data-converter/
function loadData(geojson) {
    $.getJSON('https://raw.githubusercontent.com/chelseadelgrande/stabilizationOvertime_choro/master/Stabilization_W1.json')
        .done(function (data) {
            joinData(data, geojson);
        });
}

function joinData(data, usGeoJSON) {

    var byState = {};

    // Rearrange the US GeoJSON so that instead of being a big array,
    // it's an object that is indexed by the state name,
    // that we'll use to join on.
    for (var i = 0; i < usGeoJSON.features.length; i++) {
        byState[usGeoJSON.features[i].properties.Eth_Sub] =
            usGeoJSON.features[i];
    }
    for (i = 0; i < data.length; i++) {
        // Match the GeoJSON data (byState) with the tabular data
        // (data), replacing the GeoJSON feature properties
        // with the full data.
        byState[data[i].Eth_Sub].properties = data[i];
        for (var j = 0; j < variables.length; j++) {
            // Simultaneously build the table of min and max
            // values for each attribute.
            var n = variables[j];
            ranges[n].min = Math.min(data[i][n], ranges[n].min);
            ranges[n].max = Math.max(data[i][n], ranges[n].max);
        }
    }
    // Create a new GeoJSON array of features and set it
    // as the new usLayer content.
    var newFeatures = [];
    for (i in byState) {
        newFeatures.push(byState[i]);
    }
    usLayer.setGeoJSON(newFeatures);
    // Kick off by filtering on an attribute.
    setVariable(variables[0]);
    

};


// Excuse the short function name: this is not setting a JavaScript
// variable, but rather the variable by which the map is colored.
// The input is a string 'name', which specifies which column
// of the imported JSON file is used to color the map.
function setVariable(Eth_Sub) {
    var scale = ranges[Eth_Sub];
    usLayer.eachLayer(function(layer) {
        // Decide the color for each state by finding its
        // place between min & max, and choosing a particular
        // color as index.
        
        var division = Math.floor(
            (hues.length - 1) *
            ((layer.feature.properties[Eth_Sub] - scale.min) /
            (scale.max - scale.min)));
        // See full path options at
        // http://leafletjs.com/reference.html#path
        layer.setStyle({
            fillColor: hues[division],
            fillOpacity: 0.8,
            weight: 0.5
        });
        var content = '<p>Religion/Ethnicity: ' + layer.feature.properties.REM + '<br \/>' +
            'Subdistrict: ' + layer.feature.properties.Shp_Name + '<br \/>'+ 
            'Percent: ' + layer.feature.properties[Eth_Sub] +'<\/p>';
        layer.bindPopup(content);
    });
}
map.legendControl.addLegend(document.getElementById('legend').innerHTML);
