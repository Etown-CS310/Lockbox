function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username && password) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("Inside").classList.remove("hidden");
    } else {
        alert("Please enter a valid username and password.");
    }
}

function savePassword() {
    var website = document.getElementById("website").value;
    var email = document.getElementById("email").value;
    var userPassword = document.getElementById("user-password").value;

    if (website && email && userPassword) {
        var passwordsDiv = document.getElementById("passwords");
        var historyList = document.getElementById("history-list");

        // password box
        var passwordTile = document.createElement("div");
        passwordTile.classList.add("password-tile");

        // website box
        var title = document.createElement("h3");
        title.innerText = website;
        passwordTile.appendChild(title);

        // hide
        var details = document.createElement("div");
        details.classList.add("details");
        details.innerHTML = `<p>Email: ${email}</p><p>Password: ${userPassword}</p>`;
        passwordTile.appendChild(details);

        passwordsDiv.appendChild(passwordTile);

        // add it to history
        var historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerText = `User saved a password for ${website}`;
        historyList.appendChild(historyItem);

        document.getElementById("website").value = '';
        document.getElementById("email").value = '';
        document.getElementById("user-password").value = '';
    } else {
        alert("Please fill out all fields.");
    }
}

function searchPasswords() {
    var input = document.getElementById("search").value.toLowerCase();
    var passwordTiles = document.getElementsByClassName("password-tile");

    for (var i = 0; i < passwordTiles.length; i++) {
        var title = passwordTiles[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        if (title.includes(input)) {
            passwordTiles[i].style.display = "";
        } else {
            passwordTiles[i].style.display = "none";
        }
    }
}
