// Initialize variables for the map and Places Service
let map;
let placesService;
let infoWindow;

// Initialize the map when the page loads
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 11,
  });

    infoWindow = new google.maps.InfoWindow();

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

const slider = document.getElementById("slider");
const valueDisplay = document.getElementById("value-display");
slider.addEventListener("input", function () {
  valueDisplay.textContent = slider.value + " Miles";
});

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
  let radius = slider.value * 1609; // Converts miles to meters

  const request = {
    location: currentPosition,
    radius: radius,
    keyword: restaurantName,
    type: ["restaurant"],
  };

  // Use the Places Service to search for nearby restaurants
  placesService.nearbySearch(request, handleNearbyRestaurant);
  console.log(radius);
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

    // Create a list of the top 20 results
    const topResults = results.slice(0, 20);

    // Clear the previous results
    resultsList.innerHTML = "";

    // Loop through the top results and display them in the list
    topResults.forEach((place, index) => {
      const listItem = document.createElement("div");
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        map.getCenter(),
        place.geometry.location
      );

            const distanceMiles = (distance / 1609.344).toFixed(2);

      listItem.innerHTML = `<strong>${index + 1}. ${place.name}</strong> - ${
        place.vicinity
      } (Distance: ${distanceMiles} miles)`;resultsList.appendChild(listItem);
      createMarker(place); // Also, create markers for these places on the map
    });
  } else {
    // Display a message if no restaurants are found
    resultsList.innerHTML = "";
    var modal = document.querySelector(".modal");
    modal.classList.add("is-active");
  }
}

function getRandomRestaurant() {
  const currentPosition = map.getCenter();
  const radius = slider.value * 1609;
  const request = {
    location: currentPosition,
    radius: radius,
    type: ["restaurant"],
  };

  placesService.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Select a random restaurant from the results
      const randomIndex = Math.floor(Math.random() * results.length);
      const randomRestaurant = results[randomIndex];

      // Display the random restaurant name
      const randomRestaurantName = randomRestaurant.name;
      document.getElementById("randomRestaurantName").textContent =
        "Random Restaurant: " + randomRestaurantName;
    } else {
      alert("Unable to fetch random restaurant. Please try again.");
    }
  });
}

const randomRestaurantButton = document.getElementById(
  "randomRestaurantButton"
);
randomRestaurantButton.addEventListener("click", getRandomRestaurant);

function createMarker(place) {
  const restaurantLocation = place.geometry.location;
  const marker = new google.maps.Marker({
    map: map,
    position: restaurantLocation,
    title: place.name,
  });
  markers.push(marker);

  // Add a click event listener to open the InfoWindow
  marker.addListener("click", function () {
    const content = `<strong>${place.name}</strong><br>${place.vicinity}`;
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  });
}

//Bulma files
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      closeAllModals();
    }
  });
});