async function fetchRecentPasswords() {
    const userId = getUserIdFromSession();
    try {
        const response = await fetch(`http://localhost:3000/recent-credentials/${userId}`);
        const passwords = await response.json();
        const recentPasswordsList = document.getElementById('recent-passwords');
        recentPasswordsList.innerHTML = passwords.map(p => `<li>${p.website} - ${p.username}</li>`).join('');
    } catch (error) {
        console.error('Error fetching recent passwords:', error);
    }
}

async function savePassword() {
    const website = document.getElementById('website').value;
    const username = document.getElementById('site-username').value;
    const password = document.getElementById('site-password').value;
    const userId = getUserIdFromSession(); // Ensure this function retrieves the correct userId

    if (!website || !username || !password) {
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
            // Optionally, clear the input fields
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
