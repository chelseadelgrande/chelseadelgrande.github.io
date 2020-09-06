L.mapbox.accessToken = 'pk.eyJ1IjoiY2hlbHNlYWRlbGdyYW5kZSIsImEiOiJjazh4aWR3YWsxN3Y1M2dtaDE2YmdydXZ2In0.pwijKELZM0lRR6FzE90T8A';
var map2 = L.mapbox.map('map2')
    .setView([36.518319, 42.575776], 8)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/light-v10'));;

var hues2 = [
    '#fef0d9',
    '#fdcc8a',
    '#fc8d59',
    '#e34a33',
    '#b30000'
    ];

// The names of variables that we'll show in the UI for
// styling. These need to match exactly.
var variables2 = [
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
//For the dropdown menu
// Collect the range of each variable over the full set, so we know the color scale.
var ranges2 = {};
var $select2 = $('<select id=sel2></select>')
    .appendTo($('#variables2'))
    .on('change', function() {
        setVariable2($(this).val());
    });
for (var i = 0; i < variables2.length; i++) {
    ranges2[variables2[i]] = { min: Infinity, max: -Infinity };
    // Simultaneously, build the UI for selecting different
    // ranges2
    $('<option id=opt2></option>')
        .text(variables2[i])
        .attr('value', variables2[i])
        .appendTo($select2);
}

// Create a layer of state features, and when it's done
// loading, run loadData
var usLayer2 = L.mapbox.featureLayer('https://raw.githubusercontent.com/chelseadelgrande/stabilizationOvertime_choro/master/stabilizationW2.geojson')
    .on('ready', function () {
        loadData2(this.getGeoJSON())
        usLayer2.eachLayer(function(layer2) {
        layer2.bindPopup(layer2.feature.properties.Eth_Sub);
        });
    }).addTo(map2);

// Grab the spreadsheet of data as JSON. If you have CSV
// data, you should convert it to JSON with
// http://shancarter.github.io/mr-data-converter/
function loadData2(geojson2) {
    $.getJSON('https://raw.githubusercontent.com/chelseadelgrande/stabilizationOvertime_choro/master/Stabilization_W2.json')
        .done(function (data2) {
            joinData2(data2, geojson2);
        });
}

function joinData2(data2, dist2GeoJSON) {

    var byDistrict2 = {};

    // Rearrange the US GeoJSON so that instead of being a big array,
    // it's an object that is indexed by the state name,
    // that we'll use to join on.
    for (var i = 0; i < dist2GeoJSON.features.length; i++) {
        byDistrict2[dist2GeoJSON.features[i].properties.Eth_Sub] =
            dist2GeoJSON.features[i];
    }
    for (i = 0; i < data2.length; i++) {
        // Match the GeoJSON data (byDistrict2) with the tabular data
        // (data), replacing the GeoJSON feature properties
        // with the full data.
        byDistrict2[data2[i].Eth_Sub].properties = data2[i];
        for (var j = 0; j < variables2.length; j++) {
            // Simultaneously build the table of min and max
            // values for each attribute.
            var n = variables2[j];
            ranges2[n].min = Math.min(data2[i][n], ranges2[n].min);
            ranges2[n].max = Math.max(data2[i][n], ranges2[n].max);
        }
    }
    // Create a new GeoJSON array of features and set it
    // as the new usLayer2 content2.
    var newFeatures2 = [];
    for (i in byDistrict2) {
        newFeatures2.push(byDistrict2[i]);
    }
    usLayer2.setGeoJSON(newFeatures2);
    // Kick off by filtering on an attribute.
    setVariable2(variables2[0]);
    

};


// Excuse the short function name: this is not setting a JavaScript
// variable, but rather the variable by which the map is colored.
// The input is a string 'name', which specifies which column
// of the imported JSON file is used to color the map.
function setVariable2(Eth_Sub) {
    var scale2 = ranges2[Eth_Sub];
    usLayer2.eachLayer(function(layer2) {
        // Decide the color for each state by finding its
        // place between min & max, and choosing a particular
        // color as index.
        
        var division2 = Math.floor(
            (hues2.length - 1) *
            ((layer2.feature.properties[Eth_Sub] - scale2.min) /
            (scale2.max - scale2.min)));
        // See full path options at
        // http://leafletjs.com/reference.html#path
        layer2.setStyle({
            fillColor: hues2[division2],
            fillOpacity: 0.8,
            weight: 0.5
        });
        var content2 = '<p>Religion/Ethnicity: ' + layer2.feature.properties.REM + '<br \/>' +
            'Subdistrict: ' + layer2.feature.properties.Shp_Name + '<br \/>'+ 
            'Percent: ' + layer2.feature.properties[Eth_Sub] +'<\/p>';
        layer2.bindPopup(content2);
    });
}
map2.legendControl.addLegend(document.getElementById('legend2').innerHTML);
