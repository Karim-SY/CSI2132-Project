window.onload = function () {
    topbar_Modifier();
    getUsers();
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

function getUsers(){

    fetch("http://localhost:8080/HotelSite/database?queryType=getPeople")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Expect a JSON response
        })
        .then((data) => {
            console.log(data);
            function formatDate(timestamp) {
                    if (!timestamp) return "N/A";
                    return new Date(timestamp).toLocaleDateString();
                }

                function generateTable(data) {
                    if (data.length === 0) return "<p>No data available.</p>";

                    let table = "<table><tr>";
                    Object.keys(data[0]).forEach(key => {
                        table += `<th>${key.replace(/_/g, ' ')}</th>`;
                    });
                    table += "</tr>";

                    data.forEach(item => {
                        table += "<tr>";
                        Object.values(item).forEach(value => {
                            if (typeof value === "number" && String(value).length === 13) {
                                value = formatDate(value);
                            }
                            table += `<td>${value !== null ? value : "N/A"}</td>`;
                        });
                        table += "</tr>";
                    });

                    table += "</table>";
                    return table;
                }

                document.getElementById("personList").innerHTML = generateTable(data);
        })
        .catch((error) => {
          console.error("Error getting users:", error);

        });
}

function logout() {
    document.cookie = `logged=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `employee=false; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    document.cookie = `ID=0; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/`;
    window.location.reload();
    window.location.href = "index.html";
}

function deleteUser(){
    const ID = document.getElementById('id').value;

    const params = new URLSearchParams({
        queryType: "deletePerson",
        ID: ID
      });

    fetch(`http://localhost:8080/HotelSite/database?${params.toString()}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Expect a JSON response
        })
        .then((data) => {

        })
        .catch((error) => {
          console.error("Error deleting user:", error);

        });
}

function register(){
    const selectedIdType = document.querySelector('input[name="idType"]:checked');

    if (selectedIdType) {
      const selectedIDValue = selectedIdType.value;
      console.log("Selected ID Type:", selectedIDValue);
    } else {
      console.log("No ID Type selected.");
    }

    const selectedRole = document.querySelector('input[name="role"]:checked');

    if (selectedRole) {
      const selectedRoleValue = selectedRole.value;
      console.log("Selected User Type:", selectedRoleValue);
    } else {
      console.log("No User Type selected.");
    }


    if (selectedRole.value === 'Employee'){
        e_register(selectedRole.value, selectedIdType.value);
    }else if (selectedRole.value === 'Customer'){
        u_register(selectedIdType.value);
    }else if (selectedRole.value === 'Manager'){
        m_register("Manager", selectedIdType.value);
    }

}

function m_register(r, id){
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const Address = document.getElementById('address').value;
    const Role = r;
    const ID_Select = id;
    const ID = document.getElementById('id').value;
    const name = firstName + " " + middleName + " " + lastName;
    const hotelID = document.getElementById('mgrHotelNo').value;

    const data = new URLSearchParams();
    data.append("ID", ID);
    data.append("Name", name);
    data.append("Address", Address);
    data.append("ID_Type", ID_Select);
    data.append("Role", Role);
    data.append("hotelNo", hotelID)

    fetch("http://localhost:8080/HotelSite/database?queryType=Add_Mod_Manager", {
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
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });

}

function e_register(r, id){
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const Address = document.getElementById('address').value;
    const Role = r;
    const ID_Select = id;
    const ID = document.getElementById('id').value;
    const name = firstName + " " + middleName + " " + lastName;

    const data = new URLSearchParams();
    data.append("ID", ID);
    data.append("Name", name);
    data.append("Address", Address);
    data.append("ID_Type", ID_Select);
    data.append("Role", Role);

    fetch("http://localhost:8080/HotelSite/database?queryType=Add_Mod_Employee", {
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
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });

}

function u_register(id){
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const Address = document.getElementById('address').value;
    const date = document.getElementById('registerDate').value;
    const ID_Select = id;
    const ID = document.getElementById('id').value;
    const name = firstName + " " + middleName + " " + lastName;

    const data = new URLSearchParams();
    data.append("ID", ID);
    data.append("Name", name);
    data.append("Address", Address);
    data.append("ID_Type", ID_Select);
    data.append("date", date);

    fetch("http://localhost:8080/HotelSite/database?queryType=Add_Mod_User", {
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
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error sending data:", error);
        return false;
    });

}

function toggleAdditionalFields() {
  const roleManagerRadio = document.getElementById('roleManager');
  const roleEmployeeRadio = document.getElementById('roleEmployee');
  const roleCustomerRadio = document.getElementById('roleCustomer');
  const registerDateField = document.getElementById('registerDateField');
  const employeeRoleField = document.getElementById('employeeRole');
  const managerRoleField = document.getElementById('ManagerHotel');

  if (roleEmployeeRadio.checked) {
    employeeRoleField.style.display = 'block';
    registerDateField.style.display = 'none';
    managerRoleField.style.display = 'none';
  } else if (roleCustomerRadio.checked) {
    registerDateField.style.display = 'block';
    employeeRoleField.style.display = 'none';
    managerRoleField.style.display = 'none';
  } else if (roleManagerRadio.checked){ // Manager or none selected
    employeeRoleField.style.display = 'none';
    registerDateField.style.display = 'none';
    managerRoleField.style.display = 'block';
  }
  else{
    employeeRoleField.style.display = 'none';
    registerDateField.style.display = 'none';
    managerRoleField.style.display = 'none';
  }
}

// Attach the function to the change event of the radio buttons
document.addEventListener('DOMContentLoaded', function() {
  const roleRadios = document.querySelectorAll('input[name="role"]');
  roleRadios.forEach(radio => {
    radio.addEventListener('change', toggleAdditionalFields);
  });

  // Call the function on page load to set the initial state based on default selection (if any)
  toggleAdditionalFields();
});

