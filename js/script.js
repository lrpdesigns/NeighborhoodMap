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
        test: true,
        businessId: 'anthropologie-burlingame'
    },
    {
        title: 'Kate Spade',
        address: '1207 Burlingame Ave',
        location: {lat:37.5788787, lng:-122.3463},
        image: 'img/kate-spade-office.jpg',
        id: "nav1",
        visible: ko.observable(true),
        test: true,
        businessId: 'kate-spade-new-york-burlingame'
    },
    {
        title: 'Trina Turk',
        address: '1223 Burlingame Ave',
        location: {lat:37.579749, lng:-122.345538},
        image: 'img/TrinaTurk.jpg',
        id: "nav2",
        visible: ko.observable(true),
        test: true,
        businessId: 'trina-turk-burlingame'
    },
    {
        title: 'The Podolls',
        address: '251 Primrose Rd',
        location: {lat:37.5773, lng:-122.3478},
        image: 'img/podolls.jpg',
        id: "nav3",
        visible: ko.observable(true),
        test: true,
        businessId: 'the-podolls-burlingame'
    },
    {
        title: 'JCrew',
        address: '1234 Burlingame Ave',
        location: {lat:37.5788, lng:-122.3471},
        image: 'img/jcrew.jpg',
        id: "nav4",
        visible: ko.observable(true),
        test: true,
        businessId: 'j-crew-burlingame'
    },
    {
        title: 'Les Deux Copines',
        address: '1433 Burlingame Ave',
        location: {lat:37.5772, lng:-122.3489},
        image: 'img/lesdeuxcopines.jpg',
        id: "nav5",
        visible: ko.observable(true),
        test: true,
        businessId: 'les-deux-copines-burlingame'
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
        var title = locations[i].title;
        var position = locations[i].location;
        var address = locations[i].address;
        var image = locations[i].image;
        var marker = new google.maps.Marker({
            title: title,
            position: position,
            image: image,
            address: address,
            id: i,
            animation: null
        });

        markers.push(marker);
        loadMarkers();
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleBounce(this);

        });

    }

}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);
    }
}

function populateInfoWindow(marker, infowindow) {
    // Ensures the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<img src="' + marker.image + '" alt="Image of ' +
            marker.title + '"><br><hr style="margin-bottom: 5px"><strong>' +
            marker.title + '</strong><br><p>' + marker.address + '</div>' + '<div>' + marker.phone + '</div>' + '<img id ="yelpLogo" src = "img/yelpLogo.jpg">');
        // Ensure the marker property is cleared if the infowindow is closed
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

// This function will display all the markers on the map
function loadMarkers() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        locations[i].marker = markers[i];
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}




var viewModel = function() {
    var self = this;
    self.itemClick = function(marker) {
        google.maps.event.trigger(this.marker, 'click');
        toggleBounce(this.marker);
    };


    for (var j = 0; j < markers.length; j++){
        console.log(markers[j]);
    }

    self.points = ko.observableArray(locations);
    console.log(self.points.length);


    self.query = ko.observable('');

    self.search = ko.computed(function(){

        if (!self.query() || self.query === undefined) {
            // Show every marker.
            for (var i = 0; i < self.points().length; i++) {
                if (self.points()[i].marker !== undefined) {
                    self.points()[i].marker.setVisible(true); // Shows the marker
                }
            }
            return self.points();
        } else{
            filter = self.query().toLowerCase();

            return ko.utils.arrayFilter(self.points(),
                function(point){
                var match = point.title.toLocaleLowerCase().indexOf(filter) > -1;
                // return point.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
                point.marker.setVisible(match);

                return match;
            });
        }


    });
};

//Authentication for YELP API
//Generates a random number and returns it as a string for OAuthentication
function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
}

//Information from yelp
var consumer_key = "yL9ObhUNJeCPm9qCHYZUQQ";
var token = "-ucqMH9TQqKg-notDbB7epIw-YjKvk32";
var secret_key = "dKgI4pSbQZfFBrv6eMhsMAxhnuI";
var secret_token = "qdgeFrMhQuX9HtLF7ewZZFoElIY";

//Ajax request, to be called later
var yelpCaller = function(place){
    //Url variable
    var yelp_url = "https://api.yelp.com/v2/business/" + place.businessId;
    //Search parameters for my YELP search
    var parameters = {
        oauth_consumer_key: consumer_key,
        oauth_token: token,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version : '1.0',
        callback: 'cb',
        location: '94010',
        term: 'shops',
        limit: 10
    };
    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, secret_key, secret_token);
    //Store the encoded signature as a property of the parameters object
    parameters.oauth_signature = encodedSignature;
    var settings = {
        url: yelp_url,
        data: parameters,
        // prevents jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        cache: true,
        dataType: 'jsonp',
        success: function(results) {
            // apply results
            console.log(results);
            //If YELP doesn't return any phone number data (so the result is undefined), an error message is displayed
            if(results.display_phone == undefined){
                place.marker.phone = "No phone number provided by Yelp API";
            }
            else{
                //This creates a phone property on the marker
                place.marker.phone =  results.display_phone;
            }
        },
        error: function() {
            place.marker.phone = 'Yelp API data could not be retrieved';
            console.log("fail");
        }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);
}

//This loops through all of the objects in the locations array and calls the function that retrieves the phone numbers from the stores
for(var i=0; i<locations.length; i++){
    yelpCaller(locations[i]);
};

ko.applyBindings(new viewModel());

//Function to display google maps error
function googleError(){
    alert("Sorry, Google Maps doesn't seem to be working :(");
};
