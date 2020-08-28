function displayMarkerGallery(marker, galleries) {
  // links leaflet map to photo gallery
	for (cursor=0; cursor<galleries.length; cursor++) {
		d = document.getElementById(galleries[cursor]);
		if (marker == galleries[cursor]) {
			d.style.display = "block";
  		if (marker != "BISC") {
  		  $('#'+marker).get(0).slick.setPosition();
  		};
		} else {
			d.style.display = "none";
			if (galleries[cursor] == "BISC") {
			  $('#BISC-video').attr('src', $('#BISC-video').attr('src'));
			};
		};
	};
}; 		  
  
  
// initialize the map
var selectedPark = L.geoJson();
var map = L.map('map').fitBounds(L.latLngBounds(L.latLng(25, -125), L.latLng(50, -75)));
// load a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 2,
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var bounds = L.latLngBounds(L.latLng(-30, -180), L.latLng(75, -30));//L.latLng(89.99346179538875, 180));
map.setMaxBounds(bounds);
map.on('drag', function() {
	map.panInsideBounds(bounds, { animate: false });
});

const homeButton = L.easyButton('<span class="fas fa-house-user" style="font-size:15px; line-height:26px;"></span>', function(btn, map) {
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

  
var unhighlightedIcon = L.Icon.extend({
  options: {
    iconUrl: "npg-assets/library/leaflet/images/marker-icon.png",
	  iconAnchor: [12, 41],
	  iconSize: [25, 41]
  }
});
  
var highlightedIcon = L.Icon.extend({
  options: {
  	iconUrl: "npg-assets/library/leaflet/images/marker-icon-lightblue.png",
  	iconAnchor: [12, 41],
  	iconSize: [25, 41]
  }
});

var otherIcon = L.Icon.extend({
  options: {
  	iconUrl: "npg-assets/library/leaflet/images/marker-icon-other.png",
  	iconAnchor: [12, 41],
  	iconSize: [25, 41]
  }
});

L.geoJSON(other_national_parks, {
  pointToLayer: function(feature, latlng){return L.marker(latlng, {icon: new otherIcon(), title: feature.properties.UNIT_NAME})}
}).addTo(map);
  
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
    
L.geoJSON(visited_national_parks, {
  pointToLayer: function(feature, latlng){return L.marker(latlng, {icon: new unhighlightedIcon(), title: feature.properties.UNIT_NAME})},
    onEachFeature: markerHighlighting
}).addTo(map);