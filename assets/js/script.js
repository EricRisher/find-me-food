// Initialize variables for the map and Places Service
let map;
let placesService;

// Initialize the map when the page loads
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 10,
  });

  // Create a Places Service for making nearby restaurant searches
  placesService = new google.maps.places.PlacesService(map);

  // Check for geolocation support and get the current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationError
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Callback function when geolocation succeeds
function onLocationSuccess(position) {
  // Set the current location as the map center
  const currentPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  map.setCenter(currentPosition);
}

// Callback function when geolocation fails
function onLocationError(error) {
  console.error("Error getting current location:", error);
}

// Function to search for nearby restaurants based on user input
function searchNearbyRestaurant() {
  const restaurantName = document.getElementById("locationInput").value;
  const currentPosition = map.getCenter();
  const request = {
    location: currentPosition,
    radius: 32187, // 20 miles in meters
    keyword: restaurantName,
  };

  // Use the Places Service to search for nearby restaurants
  placesService.nearbySearch(request, handleNearbyRestaurant);
}

// Callback function to handle nearby restaurant search results
function handleNearbyRestaurant(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    clearMarkers();
    results.forEach(createMarker);
  } else {
    alert(
      `No restaurants found with the name "${
        document.getElementById("restaurantName").value
      }".`
    );
  }
}

// Initialize an array to store markers
let markers = [];

// Function to create a marker for a restaurant
function createMarker(place) {
  const restaurantLocation = place.geometry.location;
  const marker = new google.maps.Marker({
    map: map,
    position: restaurantLocation,
    title: place.name,
  });
  markers.push(marker);
}

// Function to clear all markers from the map
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

// Function to handle nearby restaurant search results
function handleNearbyRestaurant(results, status) {
  const resultsList = document.getElementById("resultsList");

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    clearMarkers();

    // Sort the results by distance from the current location
    results.sort((a, b) => {
      const distanceA = google.maps.geometry.spherical.computeDistanceBetween(
        map.getCenter(),
        a.geometry.location
      );
      const distanceB = google.maps.geometry.spherical.computeDistanceBetween(
        map.getCenter(),
        b.geometry.location
      );
      return distanceA - distanceB;
    });

    // Create a list of the top 10 results
    const topResults = results.slice(0, 10);

    // Clear the previous results
    resultsList.innerHTML = "";

    // Loop through the top results and display them in the list
    topResults.forEach((place, index) => {
      const listItem = document.createElement("div");
      listItem.innerHTML = `<strong>${index + 1}. ${place.name}</strong> - ${
        place.vicinity
      }`;
      resultsList.appendChild(listItem);
      createMarker(place); // Also, create markers for these places on the map
    });
  } else {
    // Display a message if no restaurants are found
    resultsList.innerHTML = `No restaurants found with the name "${
      document.getElementById("restaurantName").value
    }".`;
  }
}