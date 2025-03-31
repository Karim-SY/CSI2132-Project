window.onload = function () {
    topbar_Modifier();
};

let empID = "None";

function topbar_Modifier(){
    let logged = false;
    let employee = false;

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
                empID = value;
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

function book_newUser(){
    register_customer();
    bookUser();
}

function checkin_user(){

    const ID = document.getElementById('ID').value;
    const archNo = document.getElementById("ArchNo").value;
    console.log(ID);

    const params = new URLSearchParams({
        queryType: "checkIn",
        Emp_ID: empID,
        ArchNo: archNo,
        Cust_ID: ID
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
            return true;
        }
        else{
            return false;
        }
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });
}

function register_customer(){
    const firstName = document.getElementById('F_name').value;
    const middleName = document.getElementById('M_name').value;
    const lastName = document.getElementById('L_name').value;
    const Address = document.getElementById('Addr').value;
    const ID_Select = document.querySelector('#ID_select').value;
    const ID = document.getElementById('ID').value;
    const name = firstName + " " + middleName + " " + lastName;

    const data = new URLSearchParams();
    data.append("ID", ID);
    data.append("Name", name);
    data.append("Address", Address);
    data.append("ID_Type", ID_Select);

    fetch("http://localhost:8080/HotelSite/database?queryType=RegUser", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: data.toString()})
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        return response.text();
    })
    .then((info) => {
        console.log("Success:", info);
        return true;
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });
}

function bookUser() {
    const sessionDataString = sessionStorage.getItem('bookingDetails');

    if (sessionDataString) {
      try {
        // Parse the string into a JavaScript object
        const sessionData = JSON.parse(sessionDataString);
        console.log('Retrieved Session Data:', sessionData);

        const hotelChain = sessionData.hotelChain;
        const hotelId = sessionData.hotelId;
        const roomId = sessionData.roomId;
        const checkinDate = sessionData.checkin;
        const numberOfGuests = sessionData.guests;
        const ID = document.getElementById('ID').value;

        const params = new URLSearchParams({
                queryType: "book",
                ID: ID,
                HotelNum: hotelId,
                RoomNum: roomId,
                BookDate: checkinDate,
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
                    return true;
                }
                else{
                    return false;
                }

            })
            .catch((error) => {
                console.error("Error sending data:", error);
                return false;
            });

      } catch (error) {
        console.error('Error parsing session storage data:', error);
      }
    } else {
      console.log('No data found in session storage with the key "bookingDetails".');
    }
}