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

  topbar_Modifier();
};

function topbar_Modifier(){
    let logged = false;
    let employee = false;
    let ID = "None";
    const cookieName = "logged"

    const cookies = document.cookie.split("; ");
    const cookieExists = document.cookie.split("; ").some(cookie => cookie.startsWith(`${cookieName}=`));
    console.log(cookieExists ? "Cookie exists!" : "Cookie not found.");
    let top_bar = document.getElementById("top_bar");
    let top_nav = document.getElementById("top_nav");

    if (cookieExists){
        console.log(cookies);
        for (let cookie of cookies) {
            let [key, value] = cookie.split("=");
            if (key === 'logged') {
                logged = value;
            }
            else if (key === 'employee'){
                employee = value;
            }
            else if (key === 'ID'){
                ID = value;
            }
        }
        if (logged === 'true'){
            if (employee === 'true'){
                console.log("flag1");
                top_bar.innerHTML  = "<a onClick=\"logout()\">Sign Out</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"portal.html\">Employee portal</a>";
            }
            else{
                top_bar.innerHTML  = "<a onClick=\"logout()\">Sign Out</a>";
            }
        }
    }
}

function logout() {
    document.cookie = `logged=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `employee=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `ID=0; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    window.location.reload();
    window.location.href = "index.html";

}


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
    { Chain_Name: "Luxury Stays", Address: "New York, USA" },
    { Chain_Name: "Budget Inns", Address: "Los Angeles, USA" },
    { Chain_Name: "Royal Suites", Address: "San Francisco, USA" },
    { Chain_Name: "Global Comfort", Address: "Chicago, USA" },
    { Chain_Name: "Family Resorts", Address: "Miami, USA" },
  ];

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
    option.value = hotel.Chain_Name; // Use Chain_Name as the value
    option.textContent = hotel.Chain_Name + " - " + hotel.Address; // Display both name and address
    dropdown.appendChild(option);
  });
}

// Search for available rooms based on form criteria
function searchRooms() {
  // Show loading indicator
  document.getElementById("loadingIndicator").style.display = "block";

  // Get form values
  const hotelChain = document.getElementById("locationSelection").value;
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
    queryType: "SearchRooms",
    hotelChain: hotelChain,
    rooms: rooms,
    guests: guests,
    checkin: checkin,
    checkout: checkout,
    attraction: attraction,
    stars: stars,
    maxPrice: maxPrice,
  });

  // Try to fetch room data from server
  fetch(`http://localhost:8080/HotelSite/database?${params.toString()}`)
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
      // For demo, display sample rooms
      displaySampleRooms();
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

  // Clear previous results
  resultsContainer.innerHTML = "";

  // If we have room data, update the display
  if (rooms && rooms.length > 0) {
    rooms.forEach((room) => {
      const price = room.Price || room.price;
      const hotelNum = room.Hotel_Num || room.hotelNum;
      const amenities =
        room.Amenities || room.amenities || "Free WiFi, Non-smoking";
      const roomNum = room.Room_Num || room.roomNum;
      const capacity = room.Capacity || room.capacity || 2;

      // Determine an appropriate image based on room details
      let imageSrc = "./images/roomking.jpeg";
      if (capacity > 2) {
        imageSrc = "./images/twin.jpeg";
      } else if (price < 200) {
        imageSrc = "./images/queen.jpeg";
      }

      // Create room element with formatted data
      resultsContainer.innerHTML += `
              <div class="room">
                  <h3>Room ${roomNum}</h3>
                  <p>From $${price}/night</p>
                  <img class="roomimage" src="${imageSrc}" alt="Room Image">
                  <p>${formatAmenities(amenities)}</p>
                  <p>Max capacity: ${capacity} guests</p>
                  <br>
                  <button type="button" class="bookButton" data-room-id="${roomNum}" data-hotel-num="${hotelNum}">Book room</button>
              </div>
          `;
    });

    // Re-attach event listeners to the new buttons
    attachBookButtonListeners();
  } else {
    // No rooms found
    resultsContainer.innerHTML =
      "<p>No available rooms match your criteria. Please try different search parameters.</p>";
  }

  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: "smooth" });
}

// Display sample rooms when server is unavailable
function displaySampleRooms() {
  const resultsContainer = document.getElementById("resultsContainer");

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Sample room data
  const sampleRooms = [
    {
      roomNum: "101",
      price: 233,
      capacity: 2,
      amenities:
        "Free WiFi, Non-smoking, On-site restaurant, Indoor pool, Outdoor pool, Breakfast included, Fitness center, Business center",
      imageSrc: "./images/roomking.jpeg",
      name: "1 King Bed Room",
    },
    {
      roomNum: "102",
      price: 200,
      capacity: 2,
      amenities:
        "Free WiFi, Non-smoking, On-site restaurant, Indoor pool, Outdoor pool, Breakfast included, Fitness center, Business center",
      imageSrc: "./images/queen.jpeg",
      name: "1 Queen Bed Room",
    },
    {
      roomNum: "103",
      price: 175,
      capacity: 4,
      amenities:
        "Free WiFi, Non-smoking, On-site restaurant, Indoor pool, Outdoor pool, Breakfast included, Fitness center, Business center",
      imageSrc: "./images/twin.jpeg",
      name: "2 Twin Beds Room",
    },
  ];

  // Create sample room elements
  sampleRooms.forEach((room) => {
    resultsContainer.innerHTML += `
          <div class="room">
              <h3>${room.name}</h3>
              <p>From $${room.price}/night</p>
              <img class="roomimage" src="${room.imageSrc}" alt="${room.name}">
              <p>${formatAmenities(room.amenities)}</p>
              <p>Max capacity: ${room.capacity} guests</p>
              <br>
              <button type="button" class="bookButton" data-room-id="${
                room.roomNum
              }">Book room</button>

          </div>
      `;
  });

  // Add a notice that this is sample data
  resultsContainer.innerHTML +=
    '<p class="notice">Note: Showing sample data. Could not connect to the server.</p>';

  // Re-attach event listeners to the new buttons
  attachBookButtonListeners();

  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: "smooth" });
}

// Attach event listeners to book buttons
function attachBookButtonListeners() {
  const bookButtons = document.querySelectorAll(".bookButton");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const roomId = this.getAttribute("data-room-id");
      const hotelId = this.getAttribute("data-hotel-num");
      bookRoom(roomId, hotelId);
    });
  });
}

// Format room amenities list
function formatAmenities(amenities) {
  if (typeof amenities === "string") {
    // Split by commas and format
    return amenities
      .split(",")
      .map((amenity) => `&#10003; ${amenity.trim()}`)
      .join("<br>");
  }

  if (Array.isArray(amenities)) {
    return amenities.map((amenity) => `&#10003; ${amenity}`).join("<br>");
  }

  return "&#10003; Standard amenities";
}

// Book a room
function bookRoom(roomId, hotelId) {
  // Get form values for the booking
  const hotelChain = document.getElementById("locationSelection").value;
  const checkin = document.getElementById("checkinDate").value;
  const checkout = document.getElementById("checkoutDate").value;
  const guests = document.getElementById("guestCount").value;

  // Store booking details in session storage to use on the confirmation page
  const bookingDetails = {
    hotelChain: hotelChain,
    hotelId : hotelId,
    roomId: roomId,
    checkin: checkin,
    checkout: checkout,
    guests: guests,
  };

  sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

  let logged = false;
      let employee = false;
      let ID = "None";
      const cookieName = "logged"

      const cookies = document.cookie.split("; ");
      const cookieExists = document.cookie.split("; ").some(cookie => cookie.startsWith(`${cookieName}=`));
      console.log(cookieExists ? "Cookie exists!" : "Cookie not found.");
      let top_bar = document.getElementById("top_bar");
      let top_nav = document.getElementById("top_nav");

      if (cookieExists){
          console.log(cookies);
          for (let cookie of cookies) {
              let [key, value] = cookie.split("=");
              if (key === 'logged') {
                  logged = value;
              }
              else if (key === 'employee'){
                  employee = value;
              }
              else if (key === 'ID'){
                  ID = value;
              }
          }
      }


  // Redirect to confirmation page
  if (logged === 'true'){
    if (employee === 'true'){
        console.log("flag2");
        window.location.href = "portal-book.html"
    }
    else{
        console.log("flag2");
        window.location.href = "confirmation.html";
    }
  }
  else{
    console.log("flag3");
    window.location.href = "signin.html"
  }

}
