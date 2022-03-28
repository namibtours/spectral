mapboxgl.accessToken = 'pk.eyJ1IjoibmFtaWJ0b3VycyIsImEiOiJja3hvbWFhNGMyNzh0MnFwZTJleXQyanFjIn0.4w-RQFfS0Zy9vSxG8ZxJkQ';

function setupMap(mapboxglOptions, origin, midPoints, destination,) {
    const map = new mapboxgl.Map(mapboxglOptions);
    // Hosea Kutako International Airport

    // Endpoint Hosea Kutako International Airport

    // A simple line from origin to destination.
    const route = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [origin, ...midPoints, destination]
                }
            }
        ]
    };

    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    const point = {
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

    midPoints.forEach(function (point, index) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = '<span><b>' + (index + 1) + '</b></span>'

        // make a marker for each feature and add it to the map
        new mapboxgl.Marker(el, {
            offset: [15, 15]
        })
            .setLngLat(midPoints[index])
            .addTo(map);
    })

    // Add plane icon
    const planeIcon = document.createElement('div');

    planeIcon.className = 'plane';
    planeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" id="airport-15" width="21" height="21" viewBox="0 0 21 21"><g><path d="M0,0 H21 V21 H0 Z" fill="none"></path><path d="M18 9.818V11.5l-6.5-1-0.318 4.773L14 17v1l-3.5-0.682L7 18v-1l2.818-1.727L9.5 10.5 3 11.5V9.818L9.5 7.5v-3s0-1.5 1-1.5 1 1.5 1 1.5v2.818l6.5 2.5z" fill="black" stroke="hsl(135, 22%, 100%)" stroke-linejoin="round" stroke-miterlimit="4px" stroke-width="2"></path><path d="M18 9.818V11.5l-6.5-1-0.318 4.773L14 17v1l-3.5-0.682L7 18v-1l2.818-1.727L9.5 10.5 3 11.5V9.818L9.5 7.5v-3s0-1.5 1-1.5 1 1.5 1 1.5v2.818l6.5 2.5z" fill="#693"></path></g></svg>`
    new mapboxgl.Marker(planeIcon)
        .setLngLat(origin)
        .addTo(map);
    if ((origin[0] !== destination[0]) && (origin[1] !== destination[1])) {
        // Add plane icon
        const planeIcon = document.createElement('div');

        planeIcon.className = 'plane';
        planeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" id="airport-15" width="21" height="21" viewBox="0 0 21 21"><g><path d="M0,0 H21 V21 H0 Z" fill="none"></path><path d="M18 9.818V11.5l-6.5-1-0.318 4.773L14 17v1l-3.5-0.682L7 18v-1l2.818-1.727L9.5 10.5 3 11.5V9.818L9.5 7.5v-3s0-1.5 1-1.5 1 1.5 1 1.5v2.818l6.5 2.5z" fill="black" stroke="hsl(135, 22%, 100%)" stroke-linejoin="round" stroke-miterlimit="4px" stroke-width="2"></path><path d="M18 9.818V11.5l-6.5-1-0.318 4.773L14 17v1l-3.5-0.682L7 18v-1l2.818-1.727L9.5 10.5 3 11.5V9.818L9.5 7.5v-3s0-1.5 1-1.5 1 1.5 1 1.5v2.818l6.5 2.5z" fill="#693"></path></g></svg>`
        new mapboxgl.Marker(planeIcon)
            .setLngLat(destination)
            .addTo(map);
    }

    // Calculate the distance in kilometers between route start/end point.
    const lineDistance = turf.length(route.features[0]);

    const arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    const steps = 1000;

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    let counter = 0;

    map.on('load', function () {
        // Load custom image
        map.loadImage('/images/chevron-up.png', function (error, image) {
            if (error) throw error;
            map.addImage('chevron', image);
        })

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

        map.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'symbol',
            'layout': {
                // This icon is a part of the Mapbox Streets style.
                // To view all images available in a Mapbox style, open
                // the style in Mapbox Studio and click the "Images" tab.
                // To add a new image to the style at runtime see
                // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                'icon-image': 'chevron',
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });

        function animate() {
            const start =
                route.features[0].geometry.coordinates[
                counter >= steps ? counter - 1 : counter
                ];
            const end =
                route.features[0].geometry.coordinates[
                counter >= steps ? counter : counter + 1
                ];
            if (!start || !end) return;

            // Update point geometry to a new position based on counter denoting
            // the index to access the arc
            point.features[0].geometry.coordinates =
                route.features[0].geometry.coordinates[counter];

            // Calculate the bearing to ensure the icon is rotated to match the route arc
            // The bearing is calculated between the current point and the next point, except
            // at the end of the arc, which uses the previous point and the current point
            point.features[0].properties.bearing = turf.bearing(
                turf.point(start),
                turf.point(end)
            );

            // Update the source with this new data
            map.getSource('point').setData(point);

            // Request the next frame of animation as long as the end has not been reached
            if (counter < steps || mapboxglOptions.zoom === 4.5 ? counter < steps - 5 : false) {
                requestAnimationFrame(animate);
            } else {
                counter = 0
                requestAnimationFrame(animate);
            }

            counter = counter + 1;
        }

        // Start the animation
        animate(counter);
    });
}

// Map 1
setupMap({
    container: 'map1',
    style: 'mapbox://styles/namibtours/cl10f79ku000i14s7kw2io7y5',
    center: [16, -20.8],
    zoom: 4.5
}, [17.46329590140578, -22.487406703313916], [
    [16.305791852989348, -21.751013276024903],
    [15.761626483700676, -22.752212193513447],
    [14.52928667944705, -22.67172157565068],
    [15.194124046921857, -21.824004307933517],
    [15.5800967664755, -21.513313188629496],
    [15.876183672037294, -21.461167696385967],
    [15.431244079944376, -20.394013420835467],
    [15.923858812870678, -19.17769094119935],
    [16.469128021864115, -19.03593272348031],
    [17.129747500822862, -18.81255122929392],
    [17.500195944535708, -21.03510428093338],
    [17.58335779718029, -22.205157358098873]
], [17.46329590140578, -22.487406703313916])

// Map 2
setupMap({
    container: 'map2',
    style: 'mapbox://styles/namibtours/cl10f79ku000i14s7kw2io7y5',
    center: [17.5, -25],
    zoom: 4.8
}, [17.46329590140578, -22.487406703313916], [
    [17.996270439457028, -22.912448103004667],
    [18.100923506948323, -24.430027400596],
    [19.861767548782048, -25.642368618564284],
    [17.815258966546132, -27.524031205752323],
    [16.24515056044464, -26.651958439690453],
    [15.163736957611421, -26.642043796211812],
    [16.825089403822627, -25.890615551305217],
    [15.803660367805742, -24.483326763706724],
    [16.363416573212994, -24.14857423340837],
    [16.83314736144289, -22.92973774757437],
    [17.25494198733556, -22.546621830066233]
], [17.46329590140578, -22.487406703313916])

// Map 3
setupMap({
    container: 'map3',
    style: 'mapbox://styles/namibtours/cl10f79ku000i14s7kw2io7y5',
    center: [20.5, -20],
    zoom: 4
}, [17.46329590140578, -22.487406703313916], [
    [16.65270989745769, -20.81372404265782],
    [15.921198057775433, -19.1778530719573],
    [16.941561596610992, -18.806693194302532],
    [16.142628815883146, -17.741383937510566],
    [19.454479744720928, -17.870955541375512],
    [21.681224168016115, -18.138127508005102],
    [23.29723581198051, -17.86998826994856],
    [23.672607981513192, -18.329187559322243],
    [24.56700739684111, -17.539874517443728],
    [24.785865734773235, -17.882481889655185],
    [25.17114579103581, -17.79497790694005],
    [25.83087864832811, -17.931666178622116],
], [25.85524029415247, -18.08416925488341])

// Handle map expandables
const togglers = document.querySelectorAll('.map-toggler');

togglers.forEach((toggler) => {
    toggler.addEventListener('click', function () {
        toggler.classList.toggle('active')
    })
})