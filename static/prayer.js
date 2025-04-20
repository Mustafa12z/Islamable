document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('prayer-search-button');
  const locationButton = document.getElementById('prayer-location-button');
  const prayerTimesContainer = document.getElementById('prayer-times-container');

  searchButton.addEventListener('click', () => {
    const postcode = document.getElementById('prayer-postcode-input').value.trim();
    if (postcode) {
      fetchPrayerTimes(postcode)
        .then(prayerTimes => displayPrayerTimes(prayerTimes))
        .catch(error => console.error('Error fetching prayer times:', error));
    } else {
      alert('Please enter a valid postcode.');
    }
  });

  locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await fetchAddressFromCoordinates(latitude, longitude);
            const prayerTimes = await fetchPrayerTimes(address);
            displayPrayerTimes(prayerTimes);
          } catch (error) {
            console.error('Error fetching prayer times:', error);
          }
        },
        error => alert('Unable to retrieve your location.')
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });

  async function fetchAddressFromCoordinates(lat, lon) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error('Could not determine address from coordinates.');
    }
  }

  async function fetchPrayerTimes(address) {
    const today = new Date();
    const start = today.toLocaleDateString('en-GB').split('/').join('-'); // DD-MM-YYYY
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 29);
    const end = endDate.toLocaleDateString('en-GB').split('/').join('-');

    const url = `https://api.aladhan.com/v1/calendarByAddress/from/${start}/to/${end}?address=${encodeURIComponent(address)}&method=3`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      return data.data;
    } else {
      throw new Error('Error fetching prayer times');
    }
  }

  function displayPrayerTimes(prayerTimes) {
    if (!prayerTimes || prayerTimes.length === 0) {
      prayerTimesContainer.innerHTML = '<p>No prayer times available.</p>';
      return;
    }

    const todayDateStr = new Date().toISOString().split('T')[0];

    let tableHTML = `
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-green-500 text-white text-sm">
            <th class="py-3 px-4 border">Date</th>
            <th class="py-3 px-4 border">Fajr</th>
            <th class="py-3 px-4 border">Dhuhr</th>
            <th class="py-3 px-4 border">Asr</th>
            <th class="py-3 px-4 border">Maghrib</th>
            <th class="py-3 px-4 border">Isha</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700">
    `;

    prayerTimes.forEach(day => {
      const date = day.date.gregorian.date;
      const isoDate = day.date.gregorian.iso?.split('T')[0];
      const timings = day.timings;

      const isToday = isoDate === todayDateStr;
      const rowClass = isToday ? 'bg-green-100 font-bold' : 'bg-white';

      tableHTML += `
        <tr class="${rowClass} hover:bg-green-50 transition">
          <td class="py-2 px-4 border">${date}</td>
          <td class="py-2 px-4 border">${timings.Fajr?.slice(0,5)}</td>
          <td class="py-2 px-4 border">${timings.Dhuhr?.slice(0,5)}</td>
          <td class="py-2 px-4 border">${timings.Asr?.slice(0,5)}</td>
          <td class="py-2 px-4 border">${timings.Maghrib?.slice(0,5)}</td>
          <td class="py-2 px-4 border">${timings.Isha?.slice(0,5)}</td>
        </tr>
      `;
    });

    tableHTML += '</tbody></table>';
    prayerTimesContainer.innerHTML = tableHTML;
  }
});
