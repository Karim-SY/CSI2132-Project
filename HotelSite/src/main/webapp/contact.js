// Load contact information when the page loads
window.onload = function() {
    loadContacts();
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

// Load hotel chain contacts from the server
function loadContacts() {
    fetch("http://localhost:8080/HotelSite/database?queryType=GetContacts")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((contacts) => {
            displayContacts(contacts);
        })
        .catch((error) => {
            console.error("Error loading contacts from server:", error);
        });
}

// Display contacts in the contact section
function displayContacts(contacts) {
    const contactsContainer = document.getElementById("contactsContainer");
    if (!contactsContainer) return;

    let contactHtml = `<h3>Hotel Chains and Contact Numbers</h3>`;
    contacts.forEach((contact) => {
        contactHtml += `
            <p>${contact.Chain_Name}:  ${contact.Phone}</p>
        `;
    });

    contactsContainer.innerHTML = contactHtml;
}
