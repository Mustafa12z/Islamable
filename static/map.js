let map;
let markers = [];
let bounds;

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const locationButton = document.getElementById('location-button');
  const postcodeInput = document.getElementById('postcode-input');

  searchButton.addEventListener('click', () => {
    const postcode = postcodeInput.value.trim();
    if (!postcode) {
      alert('Please enter a valid postcode.');
      return;
    }
    showLoading();
    fetchLocationsByPostcode(postcode);
  });

  locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      showLoading();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchLocationsByCoordinates(latitude, longitude);
        },
        (error) => {
          hideLoading();
          alert('Error retrieving your location. Please allow location access.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  });
});

function fetchLocationsByPostcode(postcode) {
  fetch('/get-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postcode }),
  })
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      if (data.success) {
        initializeMap(data.locations);
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      hideLoading();
      console.error('Error fetching location data:', error);
      alert('An error occurred. Please try again later.');
    });
}

function fetchLocationsByCoordinates(latitude, longitude) {
  fetch(`/get-location-coordinates?lat=${latitude}&lng=${longitude}`)
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      if (data.success) {
        initializeMap(data.locations);
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      hideLoading();
      console.error('Error fetching location data:', error);
      alert('An error occurred. Please try again later.');
    });
}

async function initializeMap(locations) {
  if (!map) {
    // Import Maps and Marker libraries
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    map = new Map(document.getElementById('map'), {
      center: { lat: 51.509865, lng: -0.118092 }, // Default to London
      zoom: 12,
      mapId: '17b26b0618009eb2', // Replace with your actual Map ID
      mapTypeControl: false,
      fullscreenControl: true,
    });
  }

  // Clear existing markers and reset bounds
  markers.forEach((marker) => marker.map = null);
  markers = [];
  bounds = new google.maps.LatLngBounds();

  // Add markers using AdvancedMarkerElement with a custom halal marker image.
  locations.forEach(async (location) => {
    const markerContent = document.createElement('div');
    markerContent.className = 'cursor-pointer';
    // Use your halal image (make sure the path is correct)
    markerContent.innerHTML = `<img src="/static/images/halal-marker.png" alt="${location.name}" style="width:40px;height:40px;">`;

    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    const marker = new AdvancedMarkerElement({
      position: { lat: location.latitude, lng: location.longitude },
      map: map,
      title: location.name,
      content: markerContent,
    });

    markerContent.addEventListener('click', async () => {
      if (!location.place_id) {
        alert("Detailed information for this place is not available.");
        return;
      }
      const placeDetails = await fetchPlaceDetails(location.place_id);
      // Format the address with line breaks by replacing commas with <br>
      const formattedAddress = placeDetails.formatted_address
        ? placeDetails.formatted_address.replace(/,\s*/g, '<br>')
        : location.address;
      
      const infoWindowContent = `
        <div class="p-3 max-w-xs">
          <h4 class="font-bold text-lg text-green-600 mb-2">${placeDetails.name || location.name}</h4>
          <p class="text-gray-700">${formattedAddress}</p>
        </div>
      `;
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });
      infoWindow.open({ anchor: marker, map, shouldFocus: false });
    });

    markers.push(marker);
    bounds.extend(marker.position);
  });

  // Adjust map to fit all markers
  map.fitBounds(bounds);
}

async function fetchPlaceDetails(placeId) {
  try {
    const response = await fetch(`/get-place-details?place_id=${placeId}`);
    const data = await response.json();
    if (data.success) {
      return data.placeDetails;
    } else {
      console.error('Error fetching place details:', data.message);
      return {};
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    return {};
  }
}

function showLoading() {
  if (!document.getElementById('loading-spinner')) {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    spinner.innerHTML = '<div class="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>';
    document.body.appendChild(spinner);
  }
}

function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}
