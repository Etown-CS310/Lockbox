function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username && password) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-content").classList.remove("hidden");
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

        // Create tile for password
        var passwordTile = document.createElement("div");
        passwordTile.classList.add("password-tile");

        // Create title for website
        var title = document.createElement("h3");
        title.innerText = website;
        passwordTile.appendChild(title);

        // Make it hidden
        var details = document.createElement("div");
        details.classList.add("details");
        details.innerHTML = `<p>Email: ${email}</p><p>Password: ${userPassword}</p>`;
        passwordTile.appendChild(details);

        passwordsDiv.appendChild(passwordTile);

        // Add a new entry to the history with the specified message
        var historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerText = `User saved a password for ${website}`; // Updated message
        historyList.appendChild(historyItem);

        // Clear input fields
        document.getElementById("website").value = '';
        document.getElementById("email").value = '';
        document.getElementById("user-password").value = '';
    } else {
        alert("Please fill out all fields.");
    }
}

function searchPasswords() {
    var input = document.getElementById("search").value.toLowerCase(); // Get search input
    var passwordTiles = document.getElementsByClassName("password-tile"); // Get all password tiles

    // Loop through tiles and show/hide based on search input
    for (var i = 0; i < passwordTiles.length; i++) {
        var title = passwordTiles[i].getElementsByTagName("h3")[0].innerText.toLowerCase(); // Get the website title
        if (title.includes(input)) {
            passwordTiles[i].style.display = ""; // Show tile
        } else {
            passwordTiles[i].style.display = "none"; // Hide tile
        }
    }
}
