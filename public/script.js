function getUserIdFromSession() {
    return sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        sessionStorage.setItem('userId', data.userId); // Store userId in sessionStorage
        window.location.href = data.redirect; // Redirect to dashboard
    } else {
        document.getElementById('login-error').textContent = data.error;
    }
}

async function savePassword() {
    const website = document.getElementById('website').value;
    const username = document.getElementById('site-username').value;
    const password = document.getElementById('site-password').value;
    const userId = getUserIdFromSession(); // Ensure this function retrieves the correct userId

    if (!userId || !website || !username || !password) {
        document.getElementById('save-error').textContent = 'All fields are required.';
        return;
    }

    try {
        const response = await fetch('/store-credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, website, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('save-error').textContent = 'Password saved successfully!';

            // Update password history
            const recentPasswordsList = document.getElementById('recent-passwords');
            const historyItem = document.createElement('li');
            historyItem.textContent = `${username} saved a password for ${website}`;
            recentPasswordsList.appendChild(historyItem);

            // Create a tile for the saved password
            const passwordTile = document.createElement('div');
            passwordTile.className = 'password-tile';
            passwordTile.textContent = website;

            // Create the tooltip element
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltiptext';
            tooltip.textContent = `Username: ${username}\nPassword: ${password}`; // Set tooltip text

            // Append the tooltip to the tile
            passwordTile.appendChild(tooltip);

            // Append the tile to the all passwords section
            const allPasswordsSection = document.getElementById('all-passwords');
            allPasswordsSection.appendChild(passwordTile);

            // Clear the input fields
            document.getElementById('website').value = '';
            document.getElementById('site-username').value = '';
            document.getElementById('site-password').value = '';
        } else {
            document.getElementById('save-error').textContent = data.error;
        }
    } catch (error) {
        document.getElementById('save-error').textContent = 'An error occurred. Please try again.';
    }
}
