// Load contact information when the page loads
window.onload = function() {
    loadContacts();
};

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
