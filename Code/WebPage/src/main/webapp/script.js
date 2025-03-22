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

function updatePrice() {
    document.getElementById("priceValue").textContent = document.getElementById("priceRange").value;
}