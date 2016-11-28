var map;

// Blank array for all the listing markers.
var markers = [];

var locations = [
    {
        title: 'Anthropologie',
        address: '220 Primrose Rd',
        location: {lat:37.5771 , lng:-122.3469},
        image: 'img/anthro.jpg',
        id: "nav0",
        visible: ko.observable(true),
        test: true
    },
    {
        title: 'Kate Spade',
        address: '1207 Burlingame Ave',
        location: {lat:37.5788787, lng:-122.3463},
        image: 'img/kate-spade-office.jpg',
        id: "nav1",
        visible: ko.observable(true),
        test: true
    },
    {
        title: 'Trina Turk',
        address: '1223 Burlingame Ave',
        location: {lat:37.579749, lng:-122.345538},
        image: 'img/TrinaTurk.jpg',
        id: "nav2",
        visible: ko.observable(true),
        test: true
    },
    {
        title: 'The Podolls',
        address: '251 Primrose Rd',
        location: {lat:37.5773, lng:-122.3478},
        image: 'img/podolls.jpg',
        id: "nav3",
        visible: ko.observable(true),
        test: true
    },
    {
        title: 'JCrew',
        address: '1234 Burlingame Ave',
        location: {lat:37.5788, lng:-122.3471},
        image: 'img/jcrew.jpg',
        id: "nav4",
        visible: ko.observable(true),
        test: true
    },
    {
        title: 'Les Deux Copines',
        address: '1433 Burlingame Ave',
        location: {lat:37.5772, lng:-122.3489},
        image: 'img/lesdeuxcopines.jpg',
        id: "nav5",
        visible: ko.observable(true),
        test: true
    }
];

function initMap() {
    map = new google.maps.Map((document.getElementById('map')), {
        center:{lat: 37.5779, lng: -122.3481},
        zoom: 15,
        mapTypeControl: false
    });
    setAllMap();


    function setAllMap() {
        for (var i = 0; i < markers.length; i++) {
            if(markers[i].test === false) {markers[i].holdMarker.setMap(null);
            }
            else {
                markers[i].holdMarker.setMap(map);
            }
        }
    }

    var largeInfowindow = new google.maps.InfoWindow();

    // A for loop to create a marker for each location
    for (var i = 0; i < locations.length; i++) {
        console.log('hellooooo');
        var title = locations[i].title;
        var position = locations[i].location;
        var address = locations[i].address;
        var image = locations[i].image;
        var marker = new google.maps.Marker({
            title: title,
            position: position,
            image: image,
            address: address,
            id: i
        });

        markers.push(marker);
        loadMarkers();
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }

}

function populateInfoWindow(marker, infowindow) {
    // Ensures the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('<img src="' + marker.image + '" alt="Image of ' +
            marker.title + '"><br><hr style="margin-bottom: 5px"><strong>' +
            marker.title + '</strong><br><p>' + marker.address);
        infowindow.marker = marker;
        // Ensure the marker property is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        infowindow.open(map, marker);
        // marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker(null);
        });
        // Open the infowindow on the correct marker
        infowindow.open(map, marker);
    }
}

// This function will display all the markers on the map
function loadMarkers() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}



var viewModel = function() {
    var self = this;
    self.itemClick = function(marker) {
        console.log(this);
        google.maps.event.trigger(this.marker, 'click');
    };

    self.points = ko.observableArray(locations);

    self.query = ko.observable('');

    self.search = ko.computed(function(){
        return ko.utils.arrayFilter(self.points(), function(point){
            return point.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });
};

ko.applyBindings(new viewModel());

//Function to display google maps error
function googleError(){
    alert("Sorry, Google Maps doesn't seem to be working :(");
};