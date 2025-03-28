function e_register(){
    const firstName = document.getElementById('F_name').value;
    const middleName = document.getElementById('M_name').value;
    const lastName = document.getElementById('L_name').value;
    const Address = document.getElementById('Addr').value;
    const Role = document.getElementById('Role').value;
    const ID_Select = document.querySelector('#ID_select').value;
    const ID = document.getElementById('ID').value;
    const name = firstName + " " + middleName + " " + lastName;

    const data = new URLSearchParams();
    data.append("ID", ID);
    data.append("Name", name);
    data.append("Address", Address);
    data.append("ID_Type", ID_Select);
    data.append("Role", Role);

    fetch("http://localhost:8080/HotelSite/database?queryType=RegEmployee", {
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
        window.location.assign("portal.html");
        return true;
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });

}

