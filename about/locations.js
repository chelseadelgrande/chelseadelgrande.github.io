
	mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbHNlYWRlbGdyYW5kZSIsImEiOiJjazh4aWR3YWsxN3Y1M2dtaDE2YmdydXZ2In0.pwijKELZM0lRR6FzE90T8A';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/chelseadelgrande/ckctr9myv32iv1iqag2yp9fam',
        center: [-38.576, 42.086],
        zoom: 2
    });

    // Eureka, CA
    var origin = [-124.168819, 40.786854];

    //Fay AR
    var stop1 = [-94.177362 , 36.076281];

    //Istanbul
    var stop2 = [28.985302, 41.045296];

    //Haifa
    var stop3 = [34.990680, 32.809126];

    //Meknes
    var stop4 = [-5.542487, 33.888681];

    // Washington DC
    var destination = [-77.032, 38.913];

    // A simple line from origin to destination.
    var route = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [origin, stop1, stop2, stop3, stop4, destination]
                }
            }
        ]
    };

    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    var point = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': origin
                }
            }
        ]
    };

    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');

    var arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 500;

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
        var segment = turf.along(route.features[0], i, 'kilometers');
        arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    var counter = 0;

    map.on('load', function() {

        map.addSource('locations',{
            'type': 'geojson',
            'data': {
                "type": "FeatureCollection",
                "features": [
                  {
                    "type": "Feature",
                    "properties": {
                        "description":'<strong>Start: </strong><p>Eureka, CA</p>',
                        "title": 'Eureka, CA'
                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -124.168819, 40.786854
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {
                        "description":'<p>Fayetteville, AR</p>',
                        "title": 'Fayetteville, AR'

                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -94.177362 , 36.076281
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {
                        "description":'<p>Istanbul, Turkey</p>',
                        "title": 'Istanbul, Turkey'

                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        28.985302, 41.045296
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {
                        "description":'<p>Haifa, Israel</p>',
                        "title": 'Haifa, Israel'

                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        34.990680, 32.809126
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {
                        "description":'<p>Meknes, Morocco</p>',
                        "title": 'Meknes, Morocco'

                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -5.542487, 33.888681
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {
                        "description":'<p>Washington, DC</p>',
                        "title": 'Washington, DC'

                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        -77.032, 38.913
                      ]
                    }
                  }
                ]
              }
        })

        map.addLayer({
          'id':'text',
          'source': 'locations',
          'type': 'symbol',
          'layout': {
            'text-field': ['get', 'title'],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 1,
            'text-justify': 'auto',
             // "symbol-placement": "circle",
              "text-font": ["Open Sans Regular"],
            //  "text-field": '{title}', // part 2 of this is how to do it
              "text-size": 6,
            },
            'paint':{
              'text-color': 'white'
            }
          });
        map.addLayer({
            'id':'locations',
            'source': 'locations',
            'type': 'circle',
            'paint': {
               'circle-radius': 5,
                'circle-color': 'white',
                'circle-opacity': .3

        }

      });
        // Add a source and layer displaying a point which will be animated in a circle.
        map.addSource('route', {
            'type': 'geojson',
            'data': route
        });

        map.addSource('point', {
            'type': 'geojson',
            'data': point
        });

        map.addLayer({
            'id': 'route',
            'source': 'route',
            'type': 'line',
            'paint': {
                'line-width': 2,
                'line-color': '#007cbf'
            }
        });

// custom icons:
// https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites/basic-v8/_svg

        map.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'symbol',
            'layout': {
                'icon-image': 'airport-15',
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });

        function animate() {
            // Update point geometry to a new position based on counter denoting
            // the index to access the arc.
            point.features[0].geometry.coordinates =
                route.features[0].geometry.coordinates[counter];

            // Calculate the bearing to ensure the icon is rotated to match the route arc
            // The bearing is calculate between the current point and the next point, except
            // at the end of the arc use the previous point and the current point
            point.features[0].properties.bearing = turf.bearing(
                turf.point(
                    route.features[0].geometry.coordinates[
                        counter >= steps ? counter - 1 : counter
                    ]
                ),
                turf.point(
                    route.features[0].geometry.coordinates[
                        counter >= steps ? counter : counter + 1
                    ]
                )
            );

            // Update the source with this new data.
            map.getSource('point').setData(point);

            // Request the next frame of animation so long the end has not been reached.
            if (counter < steps) {
                requestAnimationFrame(animate);
            }

            counter = counter + 1;
        }

        document.getElementById('replay').addEventListener('click', function() {
            // Set the coordinates of the original point back to origin
            point.features[0].geometry.coordinates = origin;

            // Update the source layer
            map.getSource('point').setData(point);

            // Reset the counter
            counter = 0;

            // Restart the animation.
            animate(counter);
        });

        // Start the animation.
        animate(counter);

        map.on('click', 'locations', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
             
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
            });
             
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'locations', function() {
            map.getCanvas().style.cursor = 'pointer';
            });
             
            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'locations', function() {
            map.getCanvas().style.cursor = '';
            });

    });
