---
layout: "post"
link: "/blog/so-many-trails"
title: "So Many Trails"
date: "April 27, 2021"
skills: [Hiking, Running, Python]
desc: This tutorial walks you through how to use the p5.js JavaScript library to create an animated website background similar to that seen in the GIF above. For those of you who have not heard of p5.js, it is an open source JavaScript library targeted towards "artists, designers, educators, and beginners".
thumbnail: "/assets/blog/animated-website-background/thumbnail.png"
---

{:.images}
![Animated Website Background - 1](/assets/blog/animated-website-background/animated-website-background-1.gif)

During quarantine, I started running again with the intentions of training for the Los Angeles Marathon. Unfortunately, the 2021 LA Marathon was postponed to the fall, leaving me searching for new running goals. Coming from the hiking world, I've always been more interested in trail running than road running. I recently visited Black Star Canyon in Cleveland National Forest, climbing up to North Main Divide (FR 3S04). The road seemed to go on endlessly in both directions, and so, intrigued by the concept of following it to its terminus, I pulled up CalTopo and started mapping out a route across the forest. Quickly, the scope of this thought experiment quickly grew out of hand, far beyond my original intentions, yet it still remains a really entertaining focus for learning some new skills. While I am still very much in the middle of development, I wanted to take some time to document my progress.

### North Main Divide (FR 3S04)

North Main Divide is a forest road that runs north-south along the ridge through the Santa Ana Mountains in the northern Cleveland National Forest. It is approximately 32 miles long and popular for off-road vehicles and bicycles. Though these mountains are bordered by the Los Angeles Metropolitan Area, they can feel remote and rugged. North Main Divide does not cross any paved roads between its termini, with a number of smaller spur trails that connecting the various canyon trailheads, such as Black Star Canyon, mentioned earlier. It crests nearly at the summit of Santiago Peak, the highest point in the Santa Ana Mountains. I was impressed with how defined and continuous the route was and began thinking about the possibility of an ultramarathon race that utilized this route. 

### The Original Santa Ana 100K

My first attempt at creating a 100K ultramarathon course came together really quickly. Starting with the 32 mile long North Main Divide, I extended the route northwards, connecting with Chino Hills State Park, and traversing eastwards to Carbon Canyon. To fill out the final miles in the southern portion of the course, I plotted out a short 3 mile route to Lakeside High School in Lake Elsinore. The Lakeside High School track seemed like an ideal place to start the race course since it has plenty of parking and space for when there will be the highest concentration of racers.

Normally during a 100K race, there are aid stations distributed along the course that provide resupply and medical help to racers. When I first imagined the route, I liked the opportunity for creating a remote route so close to LA, but in creating the route in this way, I also increased many logistical difficulties regarding access and safety. While running along the North Main Divide, there aren't any access points for vehicles, requiring a multi-mile hike in if you wanted to set up an aid station. This would make the feel much more similar to an unsupported 100K, at least through this long section.

In addition to some of the obvious logistical challenges, there is a much a more pressing issue with the current route. After descending out of Cleveland National Forest, the course passing under the highway and then through a small golf course before entering Chino Hills State Park. Between the golf course and the park is a railroad crossing that seemed inconspicuous enough, but some of my friends who have actually run that section pointed out that it is actually illegal to cross. Unfortunately, this roadblock means that the dream of this current route becoming a race has been halted. So what next?

### Santa Ana Ultras Race Series

There are so many trails within Cleveland National Forest, that it is still very possible to have a 100K point to point race within the bounds of the forest. Coincidentally, forcing runners off of North Main Divide may also make logistics easier and allow for a few aid stations along the route. Joe Nakamura, my boss at Run Republic, and I have been brainstorming some possible routes. There are currently two ultras put on in the forest, Harding Hustle 50K and Chimera 50K. We want to avoid overlapping with those courses as much as possible to ensure that each race is unique.

We've come up with three races.

### A Need For Organization

As we created more routes, I wanted to visualize them together in a website. This seemed like the perfect opportunity to build my familiarity with Django Web Framework and utilize Python for processing the route information. Initially, routes were created with CalTopo which allows users to export as a CSV. I developed a short Python function that converts the CSV into a GeoJSON object, which can then be added to the Leaflet map.

{:.codeheader}
views.py
```python
def add(request):

    if request.method == "POST":
        data = request.POST
        caltopo = request.FILES.get("caltopo")
        rows = caltopo.read().decode("utf-8").split("\n")

        json_string = '{"features":[{"geometry":{"coordinates":['
        distances = []

        first = rows[1].split(",")
        json_string += '[' + first[1] + ',' + first[0] + ']'
        distances.append(float(first[4]))
        for row in rows[2:]:
            row = row.split(",")
            json_string += ',[' + row[1] + ',' + row[0] + ']'
            distances.append(float(row[4]))

        json_string += '],"type":"LineString"},"type":"Feature"}],"type":"FeatureCollection"}'
        max_dist = max(distances)

        trail = Trail.objects.create(
            name = data["name"],
            description = data["description"],
            json = json_string,
            total_distance = max_dist
        )

        for row in rows[1:]:
            row = row.split(",")
            TrailData.objects.create(
                name = trail,
                latitude = row[0],
                longitude = row[1],
                distance_meters = row[2],
                distance_miles = row[4],
                elevation_meters = row[5],
                elevation_feet = row[6],
                slope = row[7],
                aspect = row[8]
            )

        return redirect("add")

    return render(request, "home/add.html")
```

Normally, you would want to use a database which supports spatial objects, such as SPATIALite or PostGIS. Because I wanted to keep this project relatively small, I stuck with SQLite and stored the GeoJSON as a string. This does not scale well for larger applications and lacks any spatial processing capabilities, such as filtering and buffering, but is very easily implemented. The database contains two tables, Trail and TrailData. Trail stores general information about the trail (name, description, geojson, and distance). TrailData contains the coordinates which make up the trail. The route information is added to both tables automatically when you upload a route. For my purpose, the Trail table is used for the mapping and the TrailData is used for the elevation plots of each route.

I created a Django template for displaying the maps and elevation data for route:

{% raw %}
{:.codeheader}
template/course.html (map and elevation)
```html
<script src="https://d3js.org/d3.v4.js"></script>


{% for c in courses %}
    {% if forloop.first %}
        <section class="overview" style="margin-top: 56px;">
    {% else %}
        <section class="overview {% cycle 'reverse' '' %}">
    {% endif %}
            <p class="title-tall">{{ c.name }}</p>
            {% with function_name="leaflet_" %}
                {% with primary=c.pk|stringformat:"i" %}
                    {% leaflet_map function_name|add:primary callback=function_name|add:primary %}
                {% endwith %}
            {% endwith %}
            <div class="info">
                <p class="title-wide">{{ c.name }}</p>
                {% with function_name="d3_" %}
                    {% with primary=c.pk|stringformat:"i" %}
                        <div id={{ function_name|add:primary }} class="elevation"></div>
                    {% endwith %}
                {% endwith %}
                <div class="desc-wide">
                    <p style="font-size: 25px; margin-bottom: 0px;">Course Description</p>
                    <p>{{ c.description }}</p>
                </div>
            </div>
        </section>
{% endfor %}

<script type="text/javascript">
    function map_init(map, c) {
        
        var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        // create a satellite imagery layer
        var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });
        // create an object to hold layer names as you want them to appear in the basemap switcher list
        var basemaps = {
            "Streets": streets,
            "Satellite": satellite
        };

        streets.addTo(map);
        // display the control (switcher list) on the map, by default in the top right corner
        L.control.layers(basemaps).addTo(map);
        var course = L.geoJSON(c, {style: {
            "color": "#F15A29",
            "weight": 5,
            "opacity": 1
        }}).addTo(map);
        map.fitBounds(course.getBounds(), {padding: [50,50]});
        map.scrollWheelZoom.disable();

    }

    {% for c in courses %}
        function leaflet_{{c.pk}}(map) {
            map_init(map, JSON.parse('{{ c.json | safe }}'));
            var circle = new L.circleMarker([33.7595, -117.5719], {
                "fillColor": "#BF1E2D",
                "fillOpacity": 1,
                "weight": 0,
                "radius": 5
            });
            var data_{{ c.pk }} = JSON.parse('{{ courses_data | safe }}');
            data_{{ c.pk }} = data_{{ c.pk }}.filter(function(d){return d.name == {{ c.pk }};})
            
            // set the dimensions and margins of the graph
            var margin = {top: 20, right: 0, bottom: 50, left: 0};
            var width = 1000 - margin.left - margin.right;
            var height = 300 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var elevation_{{ c.pk }} = d3.select("#d3_" + {{ c.pk|stringformat:"i" }})
                .append("svg")
                .style("max-width", "1000")
                .attr("viewBox", "0 0 1000 300")
                .attr("perserveAspectRatio", "xMinYMid")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // Add X axis
            var x_{{ c.pk }} = d3.scaleLinear()
                .domain([d3.min(data_{{ c.pk }}, function(d) { return +d["distance_miles"]; }), d3.max(data_{{ c.pk }}, function(d) { return +d["distance_miles"]; })])
                //.domain([0, d3.max(data, function(d) { return +d.Rescaled; })])
                .range([ 0, width ]);

            var start = elevation_{{ c.pk }}.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x_{{ c.pk }}).tickSize(0).tickValues([0]).tickFormat("Start"))
                .attr("class", "axisRed")
                .style("text-anchor", "start")
                .style("font-size", "20px");
            
            var finish = elevation_{{ c.pk }}.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x_{{ c.pk }}).tickSize(0).tickValues([d3.max(data_{{ c.pk }}, function(d) { return +d["distance_miles"]; })]).tickFormat("Finish"))
                .attr("class", "axisRed")
                .style("text-anchor", "end")
                .style("font-size", "20px");

            // Add Y axis
            var y_{{ c.pk }} = d3.scaleLinear()
                .domain([0, d3.max(data_{{ c.pk }}, function(d) { return +d["elevation_feet"]; })])
                .range([height, 0]);

            elevation_{{ c.pk }}.append("path")
                .datum(data_{{ c.pk }})
                .attr("fill", "#F15A29")
                .attr("d", d3.area()
                    //.curve(d3.curveMonotoneX)
                    .x(function(d) { return x_{{ c.pk }}(d["distance_miles"]) })
                    .y0(y_{{ c.pk }}(0))
                    .y1(function(d) { return y_{{ c.pk }}(d["elevation_feet"]) })
                );
            
            // This allows to find the closest X index of the mouse:
            var bisect = d3.bisector(function(d) {return d["distance_miles"];}).left;
            
            // Create the circle that travels along the curve of chart
            var focusLine_{{ c.pk }} = elevation_{{ c.pk }}
                .append('g')
                .append('line')
                    .style("fill", "none")
                    .attr("stroke", "white")
                    .attr("stroke-width", "2")
                    .attr("y1", y_{{ c.pk }}(d3.max(data_{{ c.pk }}, function(d) { return +d["elevation_feet"]; }) / 10))

            var focusCircle_{{ c.pk }} = elevation_{{ c.pk }}
                .append('g')
                .append('circle')
                    .style("fill", "#BF1E2D")
                    .attr("stroke", "#BF1E2D")
                    .attr('r', 5)
                    .style("opacity", 0)

            // Create the text that travels along the curve of chart
            var focusText_{{ c.pk }} = elevation_{{ c.pk }}
                .append('g')
                .append('text')
                    .style("fill", "white")
                    .style("opacity", 0)
                    .attr("alignment-baseline", "middle")
                    .attr("y", y_{{ c.pk }}(d3.max(data_{{ c.pk }}, function(d) { return +d["elevation_feet"]; }) / 25))

            // Create a rect on top of the svg area: this rectangle recovers mouse position
            elevation_{{ c.pk }}
                .append('rect')
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr('width', width)
                .attr('height', height)
                .on('mouseover', mouseover_{{ c.pk }})
                .on('mousemove', mousemove_{{ c.pk }})
                .on('mouseout', mouseout_{{ c.pk }});
        
            // What happens when the mouse move -> show the annotations at the right positions.
            function mouseover_{{ c.pk }}() {
                focusLine_{{ c.pk }}.style("opacity", 1);
                focusCircle_{{ c.pk }}.style("opacity", 1);
                focusText_{{ c.pk }}.style("opacity", 1);
                circle.addTo(map);
            }

            function mousemove_{{ c.pk }}() {
                // recover coordinate we need
                var x0 = x_{{ c.pk }}.invert(d3.mouse(this)[0]);
                var i = bisect(data_{{ c.pk }}, x0, 1);
                selectedData = data_{{ c.pk }}[i];
                circle.setLatLng([selectedData["latitude"], selectedData["longitude"]]);
                focusLine_{{ c.pk }}
                    .attr("x1", x_{{ c.pk }}(selectedData["distance_miles"]))
                    .attr("x2", x_{{ c.pk }}(selectedData["distance_miles"]))
                    .attr("y2", y_{{ c.pk }}(selectedData["elevation_feet"]))
                focusCircle_{{ c.pk }}
                    .attr("cx", x_{{ c.pk }}(selectedData["distance_miles"]))
                    .attr("cy", y_{{ c.pk }}(selectedData["elevation_feet"]))
                focusText_{{ c.pk }}
                    .html(Math.round(selectedData["distance_miles"]*100, 2)/100 + " miles / " + Math.round(selectedData["distance_meters"]/1000*100, 2)/100 + " km / " + selectedData["elevation_feet"] + "'")
                    .attr("x", x_{{ c.pk }}(selectedData["distance_miles"]))
                if (selectedData["distance_miles"] < d3.max(data_{{ c.pk }}, function(d) { return +d["distance_miles"]; }) / 3) {
                    focusText_{{ c.pk }}
                        .attr("text-anchor", "start")
                } else if (selectedData["distance_miles"] > d3.max(data_{{ c.pk }}, function(d) { return +d["distance_miles"]; }) * 2 / 3) {
                    focusText_{{ c.pk }}
                        .attr("text-anchor", "end")
                } else  {
                    focusText_{{ c.pk }}
                        .attr("text-anchor", "middle")
                }
            }
            function mouseout_{{ c.pk }}() {
                focusLine_{{ c.pk }}.style("opacity", 0);
                focusCircle_{{ c.pk }}.style("opacity", 0);
                focusText_{{ c.pk }}.style("opacity", 0);
                map.removeLayer(circle);
            }
        }
    {% endfor %}

</script>
```
{% endraw %}