window.onload = function(){
    loadHotels();
}
/*
function loadHotels(){
    fetch('http://localhost:8080/HotelSite?queryType=${GetChainNames}')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const outputElement = document.getElementById('ChainNames')
        const result = response.text();
        outputElement.textContent = result;
        return response.text(); // Parse the response as plain text
    })
    .then(htmlText => {
        console.log('HTML received from servlet:', htmlText);
        // You can now insert this HTML into your page
        document.getElementById('content-container').innerHTML = htmlText;
    })
    .catch(error => {
        console.error('Error fetching HTML:', error);
    });
}
*/

function loadHotels() {
    fetch('http://localhost:8080/HotelSite?queryType=GetChainNames')
    .then(response => response.text()) // Get the response as plain text
    .then(htmlString => {
        const targetElement = document.getElementById('locationSelection'); // Get the element where you want to insert the HTML
        if (targetElement) {

            targetElement.innerHTML = htmlString; // Directly set the innerHTML
        } else {
            console.error("Target element not found!");
        }
    })
    .catch(error => {
        console.error("Error fetching or processing data:", error);
    });
}