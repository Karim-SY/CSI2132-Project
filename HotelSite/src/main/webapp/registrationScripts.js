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

function logout() {
    document.cookie = `logged=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `employee=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `ID=0; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    window.location.reload();
}

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

function register(){
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
        window.location.assign("index.html");
        return true;
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });

}