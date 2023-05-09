---
layout: "post"
permalink: "/blog/irregularly-shaped-leaflet-maps"
title: "Irregularly Shaped Leaflet Maps"
date: "June 25, 2021"
skills: [JavaScript, Leaflet, GIS]
description: The Leaflet JavaScript package creates interactive maps that can display geographic information, such as points, lines, and polygons. Many of my websites implement these maps in some capacity or another. By default, all maps that are generated are rectangular in shape, and for most circumstances, this provides this clearest view of all of your information.
image: "/assets/blog/irregularly-shaped-leaflet-maps/Screen Shot 2021-06-25 at 10.00.32 AM 2.png"
---


{:.images}
![Irregular Leaflet #1](/assets/blog/irregularly-shaped-leaflet-maps/Screen Shot 2021-06-25 at 10.00.32 AM 2.png)


The Leaflet JavaScript package creates interactive maps that can display geographic information, such as points, lines, and polygons. Many of my websites implement these maps in some capacity or another. By default, all maps that are generated are rectangular in shape, and for most circumstances, this provides this clearest view of all of your information. At the same time, this is a rather rigid restriction that potentially limits some of the creative ways to include a map within your website. This week, I've found a way of implementing irregularly shaped Leaflet maps that can be changed dynamically according to the polygons in a GeoJSON file.


### GeoJSON Polygon

A GeoJSON file is a special type of JSON file which stores geographic information. It is one of the most common ways to store this information and is standard across the field (non-proprietary). For this example, I am going to use a GeoJSON file that contains the administrative boundaries of Sequoia National Park. The park boundaries are stored as the variable "park_boundary", seen later in this blog post.

{:.codeheader}
sequoia.js
```javascript
var park_boundary = {
"type": "FeatureCollection",
"name": "national_parks",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
{ "type": "Feature", "properties": { "OBJECTID": 57, "UNIT_CODE": "SEQU", "GIS_Notes": "Lands - http:\/\/landsnet.nps.gov\/tractsnet\/documents\/SEQU\/Metadata\/sequ_metadata.xml", "UNIT_NAME": "Sequoia National Park", "DATE_EDIT": "2008-11-26T00:00:00.000Z", "STATE": "CA", "REGION": "PW", "GNIS_ID": "266000", "UNIT_TYPE": "National Park", "CREATED_BY": "Lands", "METADATA": "https:\/\/irma.nps.gov\/App\/Reference\/Profile\/1048045", "PARKNAME": "Sequoia", "CreationDa": "2020-01-09T22:16:03.201Z", "Creator": "SCarlton@nps.gov_nps", "EditDate": "2020-01-09T22:16:03.201Z", "Editor": "SCarlton@nps.gov_nps", "Shape__Are": 2553244941.7382798, "Shape__Len": 320822.95034296502, "GlobalID": "c07cc3e8-2f37-44fa-9c20-32b66972a030" }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -118.914647943730998, 36.608600206354502 ], [ -118.914348244688, 36.608659375380498 ], [ -118.913986268634005, 36.608726906411498 ], [ -118.913570534567995, 36.608749006441599 ], [ -118.913229898506998, 36.608712036460702 ], [ -118.913046812472004, 36.608660965467898 ], [ -118.912764831413, 36.608543640474998 ], [ -118.912398833346003, 36.608481697493403 ], [ -118.911960706277995, 36.608526394527203 ], [ -118.911571146225, 36.608645654565301 ], [ -118.911414569209001, 36.608738577585001 ], [ -118.91141651321, 36.6087473655857 ]...
```

### Leaflet Implementation

First, generate a Leaflet map that displays your polygon as usual. This code below will fit the bounds of the polygon to the map so that it is completely visible. Not all of this code will be used in the final product, but it will be useful in the process.


{% raw %}
{:.codeheader}
index.html
```html
<!DOCTYPE html>
<html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>National Parks Explorer</title>

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>

        <script src="sequoia.js"></script>

    </head>

    <body>

        <div style="position: absolute; height: 100%; width: 100%; top: 0px; left: 0px; z-index: 1;" id="map"></div>
    
        <script>
            var map = L.map('map', {
                zoomDelta: 0.1
            });

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            }).addTo(map);

            var sequoia = L.geoJSON(park_boundary).addTo(map);

            map.fitBounds(sequoia.getBounds());
        </script>

    </body>

</html>
```
{% endraw %}

Next, the most critical section of the implementation is, rather than generating a regular polygon, generating a mask that overlays the map, hiding any region that is outside the selected polygon. I found some code that extends the original Leaflet Polygon, allowing for this masking functionality ([here](https://embed.plnkr.co/plunk/1I7dIw)). I made it so that the fill color of the mask matched that of my websites background.


{% raw %}
{:.codeheader}
index.html
```html
<!DOCTYPE html>
<html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>National Parks Explorer</title>

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>

        <script src="Sequoia.js"></script>

    </head>

    <body>

        <div style="position: absolute; height: 100%; width: 100%; top: 0px; left: 0px; z-index: 1;" id="map"></div>
    
        <script>

            // credits: https://github.com/turban/Leaflet.Mask
            L.Mask = L.Polygon.extend({
                options: {
                    stroke: false,
                    color: 'white',
                    fillOpacity: 1,
                    clickable: true,

                    outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
                },

                initialize: function (latLngs, options) {
                    
                    var outerBoundsLatLngs = [
                        this.options.outerBounds.getSouthWest(),
                        this.options.outerBounds.getNorthWest(),
                        this.options.outerBounds.getNorthEast(),
                        this.options.outerBounds.getSouthEast()
                    ];
                    L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);	
                },

            });
            L.mask = function (latLngs, options) {
                return new L.Mask(latLngs, options);
            };

            var map = L.map('map', {
                zoomDelta: 0.1
            });

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            }).addTo(map);

            var coordinates = park_boundary.features[0].geometry.coordinates;
            var latLngs = [];
            for (i=0; i<coordinates.length; i++) {
                for (j=0; j<coordinates[i].length; j++) {
                    for (k=0; k<coordinates[i][j].length; k++) {
                        latLngs.push(new L.LatLng(coordinates[i][j][k][1], coordinates[i][j][k][0]));
                    }
                }
            }

            var mask = L.mask(latLngs, {interactive: false}).addTo(map);

            var sequoia = L.geoJSON(park_boundary, {color: "black", fillOpacity: 0}).addTo(map);

            map.fitBounds(sequoia.getBounds());
        </script>

    </body>

</html>
```
{% endraw %}


You now have an irregularly shaped Leaflet map that gives a bit more character to your website. One bug with this method is that dragging/panning leads to a delay where you can see the basemap before the polygon is redrawn. As much of this interactivity doesn't necessarily make sense in this particular implementation, I think that it's best to simply disable it with the following code.

{% raw %}
{:.codeheader}
index.html
```javascript
var map = L.map('map', { 
    zoomControl: true, 
    attributionControl: true, 
    dragging: false, 
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    zoomDelta: 0.1
});

map.removeControl(map.zoomControl);
map.removeControl(map.attributionControl);
```
{% endraw %}

Because this method removes the basemap attribution to achieve the desired look, it is important to add this back somewhere else on your website.

### A Bit More

I wanted to give users the ability to view the map in more detail, returning to the original rectangular shape. I made it so that the irregularly shaped map could be clicked and expanded to the full screen. This action also returns many of the interactive features to the map that were previously removed. With this method, I provided two scopes for viewing the map: a less detailed version that is initially displayed and a more detailed version for those interested in exploring more deeply.

{% raw %}
{:.codeheader}
index.html
```javascript
L.geoJSON(park_boundary, {
    color: "black",
    fillColor: 'url(#stripes)',
    fillOpacity: 1,
    onEachFeature: function (feature, layer) {
        layer.on('mouseover', function () {
            this.setStyle({
                color: "blue"
            });
            document.getElementById("title").style.color = "blue";
            // document.getElementById("title").style.opacity = 0;
            // document.getElementById("floaters").style.animationPlayState = "paused";
            // document.getElementById("shadow").style.animationPlayState = "paused";
        });
        layer.on('mouseout', function () {
            this.setStyle({
                color: "black"
            });
            document.getElementById("title").style.color = "black";
            // document.getElementById("title").style.opacity = 1;
            // document.getElementById("floaters").style.animationPlayState = "running";
            // document.getElementById("shadow").style.animationPlayState = "running";
        });
        layer.on('click', function () {
            // Let's say you've got a property called url in your geojsonfeature:
            
            document.getElementById("shadow").style.animationPlayState = "paused";
            document.getElementById("shadow").style.opacity = 0;
            document.getElementById("title").style.opacity = 0;
            document.getElementById("floaters").style.animation = "none";
            
            var polygon_gradient = this;
            setTimeout(function() {
                mask.setStyle({fillOpacity: 0});
                polygon_gradient.setStyle({fillOpacity: 0});
            }, 500, polygon_gradient);
            //this.setStyle({fillOpacity: 0});
            // document.getElementById("floaters").style.animationPlayState = "paused";
            // document.getElementById("map").style.transform = "none";

            setTimeout(function(){
                map.addControl(map.zoomControl);
                map.addControl(map.attributionControl);
                map.dragging.enable();
                map.scrollWheelZoom.enable();
                map.doubleClickZoom.enable();
                map.boxZoom.enable();
            }, 1000); 
        });
    }
}).addTo(map);


let fillPalette = ['transparent', 'rgba(0,0,0,0.65)'];

let gradientString = `<linearGradient id="stripes" x1="100%" y1="0%" x2="100%" y2="100%">
<stop offset=0 stop-color=${fillPalette[0]} />
<stop offset=100% stop-color=${fillPalette[1]} />
</linearGradient>`

let svg = document.getElementsByTagName('svg')[0];
let svgDefs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
svgDefs.insertAdjacentHTML('afterbegin', gradientString);
svg.appendChild(svgDefs);
```
{% endraw %}

I added a slight gradient overlay for the map which will make any lettering overlays a bit more visible. I also added some click functionality, which currently points to HTML objects that do not exist yet. so lets fix that.

{% raw %}
{:.codeheader}
index.html
```javascript

<style>
            
    #floaters {
        height: 100%;
        width: 100%;
        animation-name: float;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        transition: translateY 0.5;
    }

    @keyframes float {
        0% {transform: translateY(2%);}
        50% {transform: translateY(-2%);}
        100% {transform: translateY(2%);}
    }



    .leaflet-container {
        background-color:rgba(255,0,0,0.0);
    }

    .leaflet-container path{ 
        transition: fill-opacity 1s;
    }

    #title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: black;
        font-size: 30px;
        transition: opacity 0.5s;
        /*align-items: center;*/
        pointer-events: none;
    }

    #shadow {
        position: absolute;
        z-index: 3;
        bottom: 0%;
        left: 50%;
        background: radial-gradient(rgba(0,0,0,0.5), transparent, transparent);
        width: 50%;
        height: 10%;
        transform: translate(-50%, 0%);
        animation-name: shadow-size;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        transition: opacity 0.5s;
    }

    @keyframes shadow-size {
        0% {width: 50%;}
        50% {width: 75%;}
        100% {width: 50%;}
    }

    
</style>

<div id="map_section" style="position: relative; height: 100vh; width: 100vw; overflow-y: hidden;">

    <div id="floaters">
        
        <div style="position: absolute; height: 100%; width: 100%; top: 0px; left: 0px; z-index: 1;" id="map"></div>

        <div id="title" style="z-index: 2; font-weight: bold;">ENTER MAP</div>

    </div>

    <div id="shadow"></div>

</div>
```
{% endraw %}

The map section refers to the fullscreen region that the map where I display the map. I wanted the irregular shaped map to look like an interactive button, so I added some small animations (floating up and down). Lastly, I added a small shadow underneath the map that is also animated to match the floating objects. When you click on the map, the animations stop and the title and mask disappear, revealing the larger map. To expand upon this, you can have GPS points fade-in as well to highlight specific regions of your map.

{:.images}
![Irregular Leaflet #2](/assets/blog/irregularly-shaped-leaflet-maps/Screen Shot 2021-06-25 at 10.06.30 AM.png)

There are many ways to continue to expand this project. All of the code used in this post can be found [HERE](https://github.com/kitchensjn/trail-data-viz){:target="_blank"} If you enjoyed this tutorial and want to use this code in your own project, give the repository a star on GitHub and fork the project to your own profile. If you have any questions, create an Issue for the GitHub repository and I will do my best to help!