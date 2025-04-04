window.onload = function () {
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

function searchHotels() {
    const hotel = document.getElementById("hotel").value;
    const guests = document.getElementById("guests").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const attraction = document.getElementById("attraction").value;
    
    if (!checkin || !checkout) {
        alert("Please select check-in and check-out dates.");
        return;
    }
    
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p>Hotel: <strong>${hotel}</strong></p>
        <p>Guests: <strong>${guests}</strong></p>
        <p>Check-in: <strong>${checkin}</strong></p>
        <p>Check-out: <strong>${checkout}</strong></p>
        <p>Main Attraction: <strong>${attraction}</strong></p>
    `;
}

function logout() {
    document.cookie = `logged=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `employee=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `ID=0; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    window.location.reload();
    window.location.href = "index.html";
}

function checkID(){
    const ID = document.getElementById('ID').value;
    const params = new URLSearchParams({
        queryType: "checkID",
        ID: ID
      });

    fetch(`http://localhost:8080/HotelSite/database?${params.toString()}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        return response.json();
    })
    .then((info) => {
        console.log("Success:", info);
        if (info && info.length > 0 && info[0].exists === true) {
            console.log("ID exists!")
            document.cookie = `logged=true; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
            document.cookie = `employee=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
            document.cookie = `ID=${ID}; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
            window.location.assign("index.html");
            return true;
            window.location.reload();
        }
        else{
            console.log("ID does not exist")
            return false;
        }

    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });
}

function checkID_e(){
    const ID = document.getElementById('ID').value;
    const params = new URLSearchParams({
        queryType: "checkEmpID",
        ID: ID
      });

    fetch(`http://localhost:8080/HotelSite/database?${params.toString()}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        return response.json();
    })
    .then((info) => {
        console.log("Success:", info);
        if (info && info.length > 0 && info[0].exists === true) {
            console.log("ID exists!")
            document.cookie = `logged=true; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
            document.cookie = `employee=true; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
            document.cookie = `ID=${ID}; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
            window.location.assign("portal.html");
            return true;
            window.location.reload();
        }
        else{
            console.log("ID does not exist")
            return false;
        }

    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });
}

function updatePrice() {
    document.getElementById("priceValue").textContent = document.getElementById("priceRange").value;
}


/*Room editing*/
(() => {
    const roomForm = document.getElementById('roomForm');
    const roomList = document.getElementById('roomList');

    let rooms = [];
    let editingIndexRoom = -1; // Renamed to avoid conflict

    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const roomNumber = document.getElementById('roomNumber').value;
        const roomName = document.getElementById('roomName').value;
        const roomPrice = document.getElementById('roomPrice').value;
        const roomCapacity = document.getElementById('roomCapacity').value;
        const roomView = document.getElementById('roomView').value;
        const roomAmenities = document.getElementById('roomAmenities').value;
        const roomExtendable = document.getElementById('roomExtendable').value;
        const roomOccupied = document.getElementById('roomOccupied').value;
        const roomBooked = document.getElementById('roomBooked').value;
        const roomPhoto = document.getElementById('roomPhoto').files[0];
        const photoURL = roomPhoto ? URL.createObjectURL(roomPhoto) : '';

        const roomData = {
            number: roomNumber,
            name: roomName,
            price: roomPrice,
            capacity: roomCapacity,
            view: roomView,
            amenities: roomAmenities,
            extendable: roomExtendable,
            occupied: roomOccupied,
            booked: roomBooked,
            photo: photoURL
        };

        if (editingIndexRoom >= 0) {
            rooms[editingIndexRoom] = roomData;
            editingIndexRoom = -1;
        } else {
            rooms.push(roomData);
        }

        renderRooms();
        roomForm.reset();
    });

    function renderRooms() {
        roomList.innerHTML = '';

        rooms.forEach((room, index) => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';

            roomCard.innerHTML = `
                <h3>Room ${room.number}: ${room.name}</h3>
                <p>Price: $${room.price}</p>
                <p>Maximum Capacity: ${room.capacity}</p>
                <p>View: ${room.view}</p>
                <p>Amenities: ${room.amenities}</p>
                <p>Extendable: ${room.extendable}</p>
                <p>Occupied: ${room.occupied}</p>
                <p>Booked: ${room.booked}</p>
                ${room.photo ? `<img src="${room.photo}" alt="Room ${room.number}">` : ''}
                <button onclick="editRoom(${index})">Edit</button>
                <button onclick="deleteRoom(${index})">Delete</button>
            `;

            roomList.appendChild(roomCard);
        });
    }

    window.deleteRoom = function (index) {
        rooms.splice(index, 1);
        renderRooms();
    };

    window.editRoom = function (index) {
        const room = rooms[index];

        document.getElementById('roomNumber').value = room.number;
        document.getElementById('roomName').value = room.name;
        document.getElementById('roomPrice').value = room.price;
        document.getElementById('roomCapacity').value = room.capacity;
        document.getElementById('roomView').value = room.view;
        document.getElementById('roomAmenities').value = room.amenities;
        document.getElementById('roomExtendable').value = room.extendable;
        document.getElementById('roomOccupied').value = room.occupied;
        document.getElementById('roomBooked').value = room.booked;

        editingIndexRoom = index;
    };
})();

// Client/Employee Management
(() => {
    const personForm = document.getElementById('personForm');
    const personList = document.getElementById('personList');
    const registerDateField = document.getElementById('registerDateField');
    const roleField = document.getElementById('employeeRole');

    let people = [];
    let editingIndexPerson = -1; // Renamed to avoid conflict

    document.querySelectorAll('input[name="role"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === "Customer") {
                registerDateField.style.display = "block";
            } else {
                registerDateField.style.display = "none";
            }
        });
    });

    personForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const middleName = document.getElementById('middleName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const role = document.querySelector('input[name="role"]:checked')?.value || "";
        const registerDate = role === "Customer" ? document.getElementById('registerDate').value : "";
        const idType = document.querySelector('input[name="idType"]:checked')?.value || "";
        const id = document.getElementById('id').value;

        const personData = {
            firstName,
            middleName,
            lastName,
            address,
            role,
            idType,
            registerDate,
            id
        };

        if (editingIndexPerson >= 0) {
            people[editingIndexPerson] = personData;
            editingIndexPerson = -1;
        } else {
            people.push(personData);
        }

        renderPeople();
        personForm.reset();
        registerDateField.style.display = "none";
    });

    function renderPeople() {
        personList.innerHTML = '';

        people.forEach((person, index) => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h3>${person.firstName} ${person.middleName ? person.middleName + ' ' : ''}${person.lastName}</h3>
                <p>Address: ${person.address}</p>
                <p>Role: ${person.role}</p>
                ${person.role === "Customer" && person.registerDate ? `<p>Register Date: ${person.registerDate}</p>` : ''}
                <p>ID Type: ${person.idType}</p>
                <p>ID: ${person.id}</p>
                <button onclick="editPerson(${index})">Edit</button>
                <button onclick="deletePerson(${index})">Delete</button>
            `;

            personList.appendChild(card);
        });
    }

    window.deletePerson = function (index) {
        people.splice(index, 1);
        renderPeople();
    };

    window.editPerson = function (index) {
        const person = people[index];

        document.getElementById('firstName').value = person.firstName;
        document.getElementById('middleName').value = person.middleName;
        document.getElementById('lastName').value = person.lastName;
        document.getElementById('address').value = person.address;

        const roleRadios = document.querySelectorAll('input[name="role"]');
        roleRadios.forEach((radio) => {
            if (radio.value === person.role) {
                radio.checked = true;
            }
        });
        const idTypeRadios = document.querySelectorAll('input[name="idType"]');
        idTypeRadios.forEach((radio) => {
            if (radio.value === person.idType) {
                radio.checked = true;
            }
        });

        if (person.role === "Customer") {
            registerDateField.style.display = "block";
            document.getElementById('registerDate').value = person.registerDate;
        }
        else if (person.role === "Employee"){
            roleField.style.display = "block";
        }
        else {
            registerDateField.style.display = "none";
        }

        document.getElementById('id').value = person.id;

        editingIndexPerson = index;
    };
})();


