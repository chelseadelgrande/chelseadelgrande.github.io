mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbHNlYWRlbGdyYW5kZSIsImEiOiJjazh4aWR3YWsxN3Y1M2dtaDE2YmdydXZ2In0.pwijKELZM0lRR6FzE90T8A';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/chelseadelgrande/ckablwlyo0u511io7ovywvv6m',
center: [43.418621, 33.704637 ],
zoom: 5
});
//add toggle to map to go full screeen
map.addControl(new mapboxgl.FullscreenControl());
map.on('load', function() {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('population',{
	type: 'geojson',
	data: 'https://raw.githubusercontent.com/chelseadelgrande/Iraq_healthsites/master/MPI_Poverty.geojson'
});
map.addLayer({
	id:'Raw Population',
	type: 'fill',
	source: 'population',
	//filter: ['==', 'pop_region', true],
	paint: {
		'fill-color':{
			property: 'pop_region',
			stops: [
			[0,
			'#FEF0D9'],
			[1115931,
			'#FDCC8A'],
			[1320398,
			'#FC8D59'],
			[1802560,
			'#E34A33'],
			[2557264,
			'#B30000']]},
		
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map.addLayer({
	id:'Normalized Population',
	type: 'fill',
	source: 'population',
	//filter: ['==', 'pop_region', true],
	paint: {
		'fill-color':{
			property: 'perc_pop_r',
			stops: [
			[0,
			'#FEF0D9'],
			[.03,
			'#FDCC8A'],
			[.035,
			'#FC8D59'],
			[.047,
			'#E34A33'],
			[.069,
			'#B30000']]},
		
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map.addLayer({
	id:'Percent Deprived in Nutrition',
	type: 'fill',
	source: 'population',
	//filter: ['==', 'pop_region', true],
	paint: {
		'fill-color':{
			property: 'Nutrition',
			stops: [
			[1.3,
			'#FEF0D9'],
			[1.5,
			'#FDCC8A'],
			[2.7,
			'#FC8D59'],
			[4.8,
			'#E34A33'],
			[6.4,
			'#B30000']]},
		
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map.addLayer({
	id:'Child Mortality',
	type: 'fill',
	source: 'population',
	//filter: ['==', 'pop_region', true],
	paint: {
		'fill-color':{
			property: 'Child_Mort',
			stops: [
			[.266,
			'#FEF0D9'],
			[.608,
			'#FDCC8A'],
			[1.076,
			'#FC8D59'],
			[1.417,
			'#E34A33'],
			[2.15,
			'#B30000']]},
		
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map.addLayer({
	id:'Percent in Poverty (MPI)',
	type: 'fill',
	source: 'population',
	//filter: ['==', 'pop_region', true],
	paint: {
		'fill-color':{
			property: 'MPI_perc_r',
			stops: [
			[2.26,
			'#FEF0D9'],
			[3.96,
			'#FDCC8A'],
			[5.971,
			'#FC8D59'],
			[8.807,
			'#E34A33'],
			[11.66,
			'#B30000']]},
		
		'fill-opacity':.4
		},
		layout: {
			// make layer visible by default
			'visibility': 'visible',
		},
})

map.addSource('Iraq_healthsites', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: 'https://raw.githubusercontent.com/chelseadelgrande/Iraq_healthsites/master/Iraq_healthsites_points.geojson',
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'Healthcare Facilities',
type: 'circle',
source: 'Iraq_healthsites',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)

'circle-color': [
'step',
['get', 'point_count'],
'#a6bddb',
25,
'#a6bddb',
100,
'#a6bddb'
],
'circle-opacity':0.4,
'circle-radius': [
'step',
['get', 'point_count'],
10,
25,
20,
100,
30
]
},
layout: {
	// make layer visible by default
	'visibility': 'visible',
},
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'Iraq_healthsites',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12,
'visibility':'visible'
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'Iraq_healthsites',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color':  '#1a0000',
'circle-radius': 2.5,
'circle-stroke-width': .1,
},
layout: {
	'visibility': 'visible',
},
});
// inspect a cluster on click
map.on('click', 'Healthcare Facilities', function(e) {
var features = map.queryRenderedFeatures(e.point, {
layers: ['Healthcare Facilities']
});
var clusterId = features[0].properties.cluster_id;
map.getSource('Iraq_healthsites').getClusterExpansionZoom(
clusterId,
function(err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', function(e) {
var coordinates = e.features[0].geometry.coordinates.slice();
var amenity = e.features[0].properties.amenity;
var amen_name = e.features[0].properties.amen_name;


 
// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(
'Amenity: ' + amenity + '<br>Facility Name: ' + amen_name
)
.addTo(map);
});
var pointerLayers = 'Healthcare Facilities'
map.on('mouseenter', pointerLayers, function() {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', pointerLayers, function() {
map.getCanvas().style.cursor = '';
});
});

//add functionality to title
map.on('mousemove', function(e) {
  var governorates = map.queryRenderedFeatures(e.point, {
    layers: ['Percent in Poverty (MPI)','Normalized Population','Raw Population', 'Child Mortality', 'Percent Deprived in Nutrition']
  });

  if (governorates.length > 0) {
    document.getElementById('pd').innerHTML = '<p><strong>' + governorates[0].properties.ADM1_EN + '</p></strong><p>' 
	+ governorates[0].properties.perc_pop_r +' Normalized Population<br>'+ governorates[0].properties.pop_region + ' Raw Population<br>' + governorates[0].properties.MPI_perc_r + ' Percent in Poverty (MPI)<br>'+ governorates[0].properties.Nutrition +' Percent Deprived in Nutrition<br>' + governorates[0].properties.Child_Mort + ' Percent Deprived in Child Mortality' ;
  } else {
    document.getElementById('pd').innerHTML = '<p>Hover over a governorate</p>';
  }
});
var navControl = new mapboxgl.NavigationControl();
map.addControl(navControl, 'bottom-right');

map.on('load', function() {
  toggleLayer(['Normalized Population'], 'Normalized Population');
  toggleLayer(['Raw Population'], 'Raw Population');
  toggleLayer(['Percent in Poverty (MPI)'], 'Percent in Poverty (MPI)');
  toggleLayer(['Percent Deprived in Nutrition'], 'Percent Deprived in Nutrition');
  toggleLayer(['Child Mortality'], 'Percent Deprived in Child Mortality');
  toggleLayer(['Healthcare Facilities','cluster-count','unclustered-point'], 'Healthcare Facilities');

  function toggleLayer(ids, name) {
      var link = document.createElement('a');
      link.href = '#';
      // Get the visibility for all layers in the ids argument.
      var visibility = ids.map(function(id) {
        return map.getLayoutProperty(id, 'visibility');
      });
      // Get the unique values.
      var visUnique = visibility.filter(uniques);
      // Default to not visible.
      var visCssClass = '';
      // If all layers are visible, use the 'active' class so the toggle is "on".
      if ( visUnique.length === 1 && visUnique[0] === 'visible' ) {
        visCssClass = 'active';
      }
      link.className = visCssClass;
      link.textContent = name;

      link.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          for (layers in ids){
          var visibility = map.getLayoutProperty(ids[layers], 'visibility');

          if (visibility === 'visible') {
              map.setLayoutProperty(ids[layers], 'visibility', 'none');
              this.className = '';
          } else {
              this.className = 'active';
              map.setLayoutProperty(ids[layers], 'visibility', 'visible');
          }
          }

      };

      var layers = document.getElementById('leg');
      layers.appendChild(link);
  }


  // http://stackoverflow.com/a/14438954/1934
  function uniques(value, index, self) {
    return self.indexOf(value) === index;
  }

})
