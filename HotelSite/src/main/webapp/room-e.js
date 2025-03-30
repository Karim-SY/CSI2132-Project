// Initialize everything when the page loads
window.onload = function () {
  // Set minimum dates for check-in and check-out
  //setMinDates();

  // Load hotel chains from the server
  //loadHotels();
  loadHotelNums();
  // Set up event listeners
  //setupEventListeners();

  // Initialize price range display
  //updatePrice();

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

// Update price display when the slider changes
function updatePrice() {
  const priceValue = document.getElementById("priceRange").value;
  document.getElementById("priceValue").textContent = priceValue;
}

function loadHotelNums() {
    fetch("http://localhost:8080/HotelSite/database?queryType=searchHotelNum")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Expect a JSON response
        })
        .then((hotels) => {
          // Clear the dropdown and add new options
          populateHotelNumDropdown(hotels);
        })
        .catch((error) => {
          console.error("Error loading hotels from server:", error);
          // If there's an error, use the default hotels

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
  // Add each hotel as an option
  hotels.forEach((hotel) => {
    const option = document.createElement("option");
    option.value = hotel.Chain_Name; // Use Chain_Name as the value
    option.textContent = hotel.Chain_Name + " - " + hotel.Address; // Display both name and address
    dropdown.appendChild(option);
  });
}

function populateHotelNumDropdown(nums){
    const numDropdown1 = document.getElementById("hotelNumber");
    const numDropdown2 = document.getElementById("hotelNumberInput");

    nums.forEach((num) => {
        const numoption = document.createElement("option")
        numoption.value = num.Hotel_Num;
        numoption.textContent = num.Hotel_Num;
        numDropdown1.appendChild(numoption);
    });
    nums.forEach((num) => {
        const numoption = document.createElement("option")
        numoption.value = num.Hotel_Num;
        numoption.textContent = num.Hotel_Num;
        numDropdown2.appendChild(numoption);
    });
}

// Search for available rooms based on form criteria
function searchRooms() {

  // Get form values
  const hotelNum = document.getElementById("hotelNumber").value;


  // Build query parameters
  const params = new URLSearchParams({
    queryType: "getAllRooms",
    hotelNum: hotelNum
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
    });
}

// Display room search results
function displayRoomResults(rooms) {
  const resultsContainer = document.getElementById("roomList");

  // Clear previous results
  resultsContainer.innerHTML = "";

  // If we have room data, update the display
  if (rooms && rooms.length > 0) {
    rooms.forEach((room) => {
      const price = room.Price || room.price;
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

function add_update(){
    const roomNumInput = document.getElementById("roomNumber").value;
    const hotelNum_Selection = document.getElementById("hotelNumberInput").value;
    const priceInput = document.getElementById("roomPrice").value;
    const capacityInput = document.getElementById("roomCapacity").value;
    const viewInput = document.getElementById("roomView").value;
    const amenitiesInput = document.getElementById("roomAmenities").value;
    const extendableInput = document.getElementById("roomExtendable").value;
    const occupiedInput = document.getElementById("roomOccupied").value;
    const bookedInput = document.getElementById("roomBooked").value;



    const params = new URLSearchParams({
        queryType: "add_update_rooms",
        roomNumInput: roomNumInput,
        hotelNum_Selection: hotelNum_Selection,
        priceInput: priceInput,
        capacityInput: capacityInput,
        viewInput: viewInput,
        amenitiesInput: amenitiesInput,
        extendableInput: extendableInput,
        occupiedInput: occupiedInput,
        bookedInput: bookedInput,
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

