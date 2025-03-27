// Initialize everything when the page loads
window.onload = function () {
  // Set minimum dates for check-in and check-out
  setMinDates();

  // Load hotel chains from the server
  loadHotels();

  // Set up event listeners
  setupEventListeners();

  // Initialize price range display
  updatePrice();
};

// Set minimum dates for check-in (today) and check-out (tomorrow)
function setMinDates() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format dates as YYYY-MM-DD
  const todayFormatted = formatDate(today);
  const tomorrowFormatted = formatDate(tomorrow);

  // Set minimum dates and default values
  document.getElementById("checkinDate").min = todayFormatted;
  document.getElementById("checkinDate").value = todayFormatted;

  document.getElementById("checkoutDate").min = tomorrowFormatted;
  document.getElementById("checkoutDate").value = tomorrowFormatted;
}

// Format a date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Setup all event listeners
function setupEventListeners() {
  // Price range slider
  document.getElementById("priceRange").addEventListener("input", updatePrice);

  // Check-in date changes
  document
    .getElementById("checkinDate")
    .addEventListener("change", function () {
      // Update minimum checkout date to be at least one day after check-in
      const checkinDate = new Date(this.value);
      const nextDay = new Date(checkinDate);
      nextDay.setDate(checkinDate.getDate() + 1);

      const checkoutInput = document.getElementById("checkoutDate");
      checkoutInput.min = formatDate(nextDay);

      // If current checkout date is before new check-in date, update it
      if (new Date(checkoutInput.value) <= checkinDate) {
        checkoutInput.value = formatDate(nextDay);
      }
    });

  // Form submission
  document
    .getElementById("bookingForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      searchRooms();
    });

  // Book room buttons
  const bookButtons = document.querySelectorAll(".bookButton");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const roomId = this.getAttribute("data-room-id");
      bookRoom(roomId);
    });
  });
}

// Update price display when the slider changes
function updatePrice() {
  const priceValue = document.getElementById("priceRange").value;
  document.getElementById("priceValue").textContent = priceValue;
}

// Load hotel chains from the server
function loadHotels() {
  // Show default options in case the server is down
  const defaultHotels = [
    { id: "101", name: "Grand Horizon New York" },
    { id: "102", name: "Grand Horizon Aspen Retreat" },
    { id: "103", name: "Grand Horizon Miami Beach" },
    { id: "104", name: "Grand Horizon Las Vegas" },
    { id: "105", name: "Grand Horizon Napa Valley" },
  ];

  const dropdown = document.getElementById("locationSelection");

  // First try to load from the server
  fetch("http://localhost:8080/HotelSite/database?queryType=GetChainNames")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Expect a JSON response
    })
    .then((hotels) => {
      // Clear the dropdown and add new options
      console.log(hotels);
      populateHotelDropdown(hotels);
    })
    .catch((error) => {
      console.error("Error loading hotels from server:", error);
      // If there's an error, use the default hotels
      populateHotelDropdown(defaultHotels);

      // Show a message about using default data
      const errorMessages = document.getElementById("errorMessages");
      errorMessages.innerHTML =
        "<p>Could not connect to the server. Using sample data instead.</p>";
      errorMessages.style.display = "block";
    });
}

// Populate the hotel dropdown with options
function populateHotelDropdown(hotels) {
  const dropdown = document.getElementById("locationSelection");

  // Clear existing options except the first one
  while (dropdown.options.length > 1) {
    dropdown.remove(1);
  }

  // Add each hotel as an option
  hotels.forEach((hotel) => {
    const option = document.createElement("option");
    option.value = hotel.id || hotel.value;
    option.textContent = hotel.name || hotel.text;
    dropdown.appendChild(option);
  });
}

// Search for available rooms based on form criteria
function searchRooms() {
  // Show loading indicator
  document.getElementById("loadingIndicator").style.display = "block";

  // Get form values
  const hotelId = document.getElementById("locationSelection").value;
  const rooms = document.getElementById("roomCount").value;
  const guests = document.getElementById("guestCount").value;
  const checkin = document.getElementById("checkinDate").value;
  const checkout = document.getElementById("checkoutDate").value;
  const attraction = document.getElementById("attractionType").value;
  const stars = document.getElementById("starRating").value;
  const maxPrice = document.getElementById("priceRange").value;

  // Validate dates
  if (!validateDates(checkin, checkout)) {
    document.getElementById("loadingIndicator").style.display = "none";
    return;
  }

  // Build query parameters
  const params = new URLSearchParams({
    hotel: hotelId,
    rooms: rooms,
    guests: guests,
    checkin: checkin,
    checkout: checkout,
    attraction: attraction,
    stars: stars,
    maxPrice: maxPrice,
  });

  // Try to fetch room data from server
  fetch(
    `http://localhost:8080/HotelSite/database?queryType=SearchRooms&${params.toString()}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((rooms) => {
      // Update room results
      displayRoomResults(rooms);
    })
    .catch((error) => {
      console.error("Error searching for rooms:", error);
      // For demo, just scroll to existing results
      document
        .getElementById("resultsContainer")
        .scrollIntoView({ behavior: "smooth" });
    })
    .finally(() => {
      // Hide loading indicator
      document.getElementById("loadingIndicator").style.display = "none";
    });
}

// Validate check-in and check-out dates
function validateDates(checkin, checkout) {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const errorMessages = document.getElementById("errorMessages");
  errorMessages.innerHTML = "";

  if (checkinDate < today) {
    errorMessages.innerHTML += "<p>Check-in date cannot be in the past.</p>";
    errorMessages.style.display = "block";
    return false;
  }

  if (checkoutDate <= checkinDate) {
    errorMessages.innerHTML +=
      "<p>Check-out date must be after check-in date.</p>";
    errorMessages.style.display = "block";
    return false;
  }

  errorMessages.style.display = "none";
  return true;
}

// Display room search results
function displayRoomResults(rooms) {
  const resultsContainer = document.getElementById("resultsContainer");

  // If we have actual room data, update the display
  if (rooms && rooms.length > 0) {
    resultsContainer.innerHTML = "";

    rooms.forEach((room) => {
      resultsContainer.innerHTML += `
                <div class="room">
                    <h3>${room.name}</h3>
                    <p>From $${room.price}/night</p>
                    <img class="roomimage" src="${room.image}" alt="${
        room.name
      }">
                    <p>${formatAmenities(room.amenities)}</p>
                    <br>
                    <button type="button" class="bookButton" data-room-id="${
                      room.id
                    }">Book room</button>
                </div>
            `;
    });

    // Re-attach event listeners to the new buttons
    const bookButtons = document.querySelectorAll(".bookButton");
    bookButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const roomId = this.getAttribute("data-room-id");
        bookRoom(roomId);
      });
    });
  }

  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: "smooth" });
}

// Format room amenities list
function formatAmenities(amenities) {
  if (typeof amenities === "string") {
    return amenities; // Already formatted
  }

  if (Array.isArray(amenities)) {
    return amenities.map((amenity) => `&#10003; ${amenity}`).join("<br>");
  }

  return "";
}

// Book a room
function bookRoom(roomId) {
  // Get form values for the booking
  const hotelId = document.getElementById("locationSelection").value;
  const checkin = document.getElementById("checkinDate").value;
  const checkout = document.getElementById("checkoutDate").value;
  const guests = document.getElementById("guestCount").value;

  // Store booking details in session storage to use on the confirmation page
  const bookingDetails = {
    hotelId: hotelId,
    roomId: roomId,
    checkin: checkin,
    checkout: checkout,
    guests: guests,
  };

  sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  // Redirect to confirmation page
  window.location.href = "confirmation.html";
}
