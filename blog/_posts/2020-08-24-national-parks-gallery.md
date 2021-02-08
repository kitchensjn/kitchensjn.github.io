---
layout: post
link: /blog/national-parks-gallery
title: National Parks Gallery
github-link: https://github.com/kitchensjn/national-parks-gallery
date: August 24, 2020
skills: [Hiking, Photography, JavaScript]
desc: During the summer of 2019, I was an intern in the Mathematical and Theoretical Biology Institute summer internship program at Arizona State University in Tempe, Arizona. At the end of the summer, my partner (Margaret Graham) and I went on a two week-long road trip around the western United States before heading back east.
thumbnail: /assets/blog/national-parks-gallery/thumbnail.png
---

During the summer of 2019, I was an intern in the Mathematical and Theoretical Biology Institute summer internship program at Arizona State University in Tempe, Arizona. At the end of the summer, my partner (Margaret Graham) and I went on a two week-long road trip around the western United States before heading back east. My program finished two weeks before Margaret's, and, hoping to get a little reprieve from the summer desert heat, I headed up to the John Muir Trail and started a section hike until Margaret could come up and join me. I hiked north from the Golden Trout Wilderness to Mammoth Lakes through Kings Canyon and Sequoia National Parks, summiting Mount Whitney (14,505’, highest point in the contiguous United States).

{:.images}
![Sequoia - Mount Whitney](/assets/blog/national-parks-gallery/photos/SEQU/Photo Jul 30, 10 05 39 AM.jpg)

Margaret picked me up in Mammoth Lakes and from there, we started our whirlwind tour, visiting Yosemite, Kings Canyon, Sequoia, Zion, Bryce Canyon, Arches, Canyonlands, and White Sands over our weeks on the road.

{:.images}
![Sequoia - Moro Rock](/assets/blog/national-parks-gallery/photos/SEQU/DSC_9647.jpg)

{:.images}
![Yosemite - Half Dome](/assets/blog/national-parks-gallery/photos/YOSE/DSC_9306.jpg)

{:.vertical_images}
![Yosemite - El Capitan](/assets/blog/national-parks-gallery/photos/YOSE/DSC_2423.jpg)

{:.images}
![Zion - Angels Landing](/assets/blog/national-parks-gallery/photos/ZION/DSC_9830.jpg)

{:.vertical_images}
![Bryce Canyon - Inspiration Point](/assets/blog/national-parks-gallery/photos/BRCA/DSC_9902.jpg)

{:.vertical_images}
![Arches - Delicate Arch](/assets/blog/national-parks-gallery/photos/ARCH/DSC_0033.jpg)

{:.images}
![White Sands - Stormy Sunset](/assets/blog/national-parks-gallery/photos/WHSA/DSC_0503.jpg)

This trip cemented our love of the National Parks System and all of the public lands across the United States. We are hoping to visit all of the US National Parks; I have currently visited 22 of the 63 parks. Margaret, being an amazing photographer, has documented our times in the parks, and I’ve put these pictures together into an interactive gallery. The gallery was made in JavaScript using the leaflet, easy-button, slick, and magnific-popup libraries. I placed markers at the centroid of each national park boundary. Parks that I have visited are colored blue and have been made interactive, whereas others are colored grey.

{:.codeheader}
map.js
```javascript
var selectedPark = L.geoJson();
var map = L.map('map').fitBounds(L.latLngBounds(L.latLng(25, -125), L.latLng(50, -75)));
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 2,
  maxZoom: 19,
  attribution: '&copy; &lt;a href="https://www.openstreetmap.org/copyright">OpenStreetMap&lt;/a> contributors'
}).addTo(map);
var bounds = L.latLngBounds(L.latLng(-30, -180), L.latLng(75, -30));
map.setMaxBounds(bounds);
map.on('drag', function() {
  map.panInsideBounds(bounds, { animate: false });
});

var unhighlightedIcon = L.Icon.extend({
  options: {
    iconUrl: "/assets/blog/national-parks-gallery/library/leaflet/images/marker-icon.png",
    iconAnchor: [12, 41],
    iconSize: [25, 41]
  }
});
var highlightedIcon = L.Icon.extend({
  options: {
    iconUrl: "/assets/blog/national-parks-gallery/library/leaflet/images/marker-icon-lightblue.png",
    iconAnchor: [12, 41],
    iconSize: [25, 41]
  }
});
var otherIcon = L.Icon.extend({
  options: {
    iconUrl: "/assets/blog/national-parks-gallery/library/leaflet/images/marker-icon-other.png",
    iconAnchor: [12, 41],
    iconSize: [25, 41]
  }
});

L.geoJSON(other_national_parks, {
  pointToLayer: function(feature, latlng){return L.marker(latlng, {icon: new otherIcon(), title: feature.properties.UNIT_NAME})}
}).addTo(map);
    
L.geoJSON(visited_national_parks, {
  pointToLayer: function(feature, latlng){return L.marker(latlng, {icon: new unhighlightedIcon(), title: feature.properties.UNIT_NAME})},
    onEachFeature: markerHighlighting
}).addTo(map);
```

On click, the leaflet map displays the park boundary and zooms in to the boundary’s extent. This action also interacts with the slick carousel containing the photos from the parks, filtering to display only photos from the selected park. The slick carousel is set to autoplay through the photos. Thumbnails can be clicked to view a higher resolution version of the photos using the magnific-popup library. I’ve linked the magnific-popup controls with the slick carousel controls so that the slick carousel is always centered on the viewed photo.

{:.codeheader}
map.js
```javascript
function markerHighlighting (feature, layers) {
  layers.on('click', function(marker) {
    map.removeLayer(selectedPark);
    selectedPark = L.geoJson(park_boundaries, {
      filter: function(feature, layer) {
        return feature.properties.UNIT_CODE == marker.sourceTarget.feature.properties.UNIT_CODE;
      }
    }).addTo(map);
    map.fitBounds(selectedPark.getBounds());
    displayMarkerGallery(marker.sourceTarget.feature.properties.UNIT_CODE, ['ALL', 'HAVO', 'ACAD', 'GRSM', 'MORA', 'BISC', 'SHEN', 'ARCH', 'SEQU', 'BRCA', 'WHSA', 'GRCA', 'KICA', 'CARE', 'DEVA', 'ROMO', 'SAGU', 'CONG', 'CANY', 'ZION', 'JOTR', 'YOSE', 'EVER']);
  });
  layers.on('mouseover', function(marker) {
    marker.target.setIcon(new highlightedIcon);
  });
  layers.on('mouseout', function(marker) {
    marker.target.setIcon(new unhighlightedIcon);
  });
};
```

{:.codeheader}
gallery.js
```javascript
$('.slick-slider').lazy();
$('.embeddedYoutube').lazy();

$(".slick-slider")
  .slick({
      dots: false,
      infinite: true,
      centerMode: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      autoplay: true,
      arrows: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      draggable: false,
      initialSlide: 0,
      lazyLoad: 'ondemand'
  });

$(".slick-slider").each(function() {
  $(this).magnificPopup({
    delegate: 'a',
    type: 'image',
    showCloseBtn: false,
    tLoading: '',
    mainClass: 'mfp-img-mobile',
    gallery: {
      arrowMarkup: '&lt;button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%">&lt;/button>',
      enabled: true,
      navigateByImgClick: true,
      tCounter: '&lt;span class="mfp-counter">&lt;/span>',
      preload: 0 // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '&lt;a href="%url%">The image #%curr%&lt;/a> could not be loaded.'
    },
    callbacks: {
      beforeOpen: function() {
        $('.slick-slider').slick('slickPause');
      },
      afterClose: function() {
        $('.slick-slider').slick('slickPlay');
      },
      change: function() {
        $('.slick-slider').slick('slickGoTo', (this.index-2)%((this.items.length-2)/2));
      }
    }
  });
});
```

Lastly, I included a simple home button to return to the initial map extent and general photo set using the easy-button library. You can also return to these initial conditions if you zoom far enough out.

{:.codeheader}
map.js
```javascript
const homeButton = L.easyButton('&lt;span class="fas fa-house-user" style="font-size:15px; line-height:26px;">&lt;/span>', function(btn, map) {
  map.removeLayer(selectedPark);
  map.fitBounds(L.latLngBounds(L.latLng(25, -125), L.latLng(50, -75)));
  displayMarkerGallery('ALL', ['ALL', 'HAVO', 'ACAD', 'GRSM', 'MORA', 'BISC', 'SHEN', 'ARCH', 'SEQU', 'BRCA', 'WHSA', 'GRCA', 'KICA', 'CARE', 'DEVA', 'ROMO', 'SAGU', 'CONG', 'CANY', 'ZION', 'JOTR', 'YOSE', 'EVER']);
  selectedPark = L.geoJson();
}).addTo(map);
homeButton.button.style.padding = '0px';

map.on('zoomend', function() {
  if (map.getZoom() < 7 & selectedPark != L.geoJson()) {
    map.removeLayer(selectedPark);
    displayMarkerGallery('ALL', ['ALL', 'HAVO', 'ACAD', 'GRSM', 'MORA', 'BISC', 'SHEN', 'ARCH', 'SEQU', 'BRCA', 'WHSA', 'GRCA', 'KICA', 'CARE', 'DEVA', 'ROMO', 'SAGU', 'CONG', 'CANY', 'ZION', 'JOTR', 'YOSE', 'EVER']);
    selectedPark = L.geoJson();
  };
});
```

As we visit new national parks, I will continue to update the National Parks Gallery with any new pictures from our trips!

All of the code used in this post can be found [HERE](https://github.com/kitchensjn/national-parks-gallery){:target="_blank"}. This template could be useful for displaying any geographically grouped photo collections. If you enjoyed this tutorial and want to use this code in your own project, give the repository a star on GitHub and fork the project to your own profile. If you have any questions, create an Issue for the GitHub repository and I will do my best to help!