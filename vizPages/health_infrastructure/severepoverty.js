mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbHNlYWRlbGdyYW5kZSIsImEiOiJjazh4aWR3YWsxN3Y1M2dtaDE2YmdydXZ2In0.pwijKELZM0lRR6FzE90T8A';
var map2 = new mapboxgl.Map({
container: 'map2',
style: 'mapbox://styles/chelseadelgrande/ckablwlyo0u511io7ovywvv6m',
center: [43.418621, 33.704637 ],
zoom: 5
});
//add toggle to allow map to go full screeen
map2.addControl(new mapboxgl.FullscreenControl());

var stateLegendEl = document.getElementById('legend');
map2.on('load', function() {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map2.addSource('hotspots',{
	type: 'geojson',
	data: 'https://raw.githubusercontent.com/chelseadelgrande/Iraq_healthsites/master/Final_hotspots.geojson'
});
map2.addLayer({
	id:'Poverty Hotspots',
	type: 'fill',
	source: 'hotspots',
	paint: {
		'fill-color':{
			property: 'Pov',
			stops: [
			[-3,
			'#b2182b'],
			[-2,
			'#ef8a62'],
			[-1,
			'#fddbc7'],
			[0,
			'#f7f7f7'],
			[1,
            '#d1e5f0'],
            [2,
            '#67a9cf',],
            [3,
            '#2166ac']]},
		
		'fill-opacity':.4
		},
		layout: {
			// make layer visible by default
			'visibility': 'visible'
		},
})
map2.addLayer({
	id:'Severe Poverty Hotspots',
	type: 'fill',
	source: 'hotspots',
	paint: {
		'fill-color':{
			property: 'Sev_Pov',
			stops: [
                [-3,
                '#b2182b'],
                [-2,
                '#ef8a62'],
                [-1,
                '#fddbc7'],
                [0,
                '#f7f7f7'],
                [1,
                '#d1e5f0'],
                [2,
                '#67a9cf',],
                [3,
                '#2166ac']]},
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map2.addLayer({
	id:'Nutrition Hotspots',
	type: 'fill',
	source: 'hotspots',
	paint: {
		'fill-color':{
			property: 'Nutr',
			stops: [
                [-3,
                '#b2182b'],
                [-2,
                '#ef8a62'],
                [-1,
                '#fddbc7'],
                [0,
                '#f7f7f7'],
                [1,
                '#d1e5f0'],
                [2,
                '#67a9cf',],
                [3,
                '#2166ac']]},
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map2.addLayer({
	id:'Child Mortality',
	type: 'fill',
	source: 'hotspots',
	paint: {
		'fill-color':{
			property: 'ChMort',
			stops: [
                [-3,
                '#b2182b'],
                [-2,
                '#ef8a62'],
                [-1,
                '#fddbc7'],
                [0,
                '#f7f7f7'],
                [1,
                '#d1e5f0'],
                [2,
                '#67a9cf',],
                [3,
                '#2166ac']]},
		'fill-opacity':.4
		},
		layout: {
			// make layer invisible by default
			'visibility': 'none'
		},
})
map2.addLayer({
	id:'School Attendance',
	type: 'fill',
	source: 'hotspots',
	//filter: ['==', 'pop_region', true],
	paint: {
		'fill-color':{
			property: 'SAttend',
			stops: [
                [-3,
                '#b2182b'],
                [-2,
                '#ef8a62'],
                [-1,
                '#fddbc7'],
                [0,
                '#f7f7f7'],
                [1,
                '#d1e5f0'],
                [2,
                '#67a9cf',],
                [3,
                '#2166ac']]},	
		'fill-opacity':.4
		},
		layout: {
			// make layer visible by default
			'visibility': 'none',
		},
})

});
var navControl = new mapboxgl.NavigationControl();
map2.addControl(navControl, 'bottom-right');

map2.on('load', function() {
  toggleLayer(['Poverty Hotspots'], 'Poverty Hotspots');
  toggleLayer(['Severe Poverty Hotspots'], 'Severe Poverty Hotspots');
  toggleLayer(['Nutrition Hotspots'], 'Deprived in Nutrition Hotspots');
  toggleLayer(['Child Mortality'], 'Child Mortality Hotspots');
  toggleLayer(['School Attendance'], 'Low School Attendance Hotspots');

  function toggleLayer(ids, name) {
      var link = document.createElement('a');
      link.href = '#';
      // Get the visibility for all layers in the ids argument.
      var visibility = ids.map(function(id) {
        return map2.getLayoutProperty(id, 'visibility');
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
          var visibility = map2.getLayoutProperty(ids[layers], 'visibility');

          if (visibility === 'visible') {
              map2.setLayoutProperty(ids[layers], 'visibility', 'none');
              this.className = '';
          } else {
              this.className = 'active';
              map2.setLayoutProperty(ids[layers], 'visibility', 'visible');
          }
          }

      };

      var layers = document.getElementById('menu2');
      layers.appendChild(link);
  }

  // http://stackoverflow.com/a/14438954/1934
  function uniques(value, index, self) {
    return self.indexOf(value) === index;
  }

})
