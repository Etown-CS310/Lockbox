// Fetch all users
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to add a new user
async function addUser(newUser) {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        if (!response.ok) {
            throw new Error('Failed to add user');
        }
        const data = await response.json();
        console.log('User added:', data);
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

// Call to fetch users (consider moving this call to where appropriate)
fetchUsers();

// Login function
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('Inside').classList.remove('hidden');
        } else {
            const errorText = await response.text();
            console.error('Login failed:', errorText);
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function to save a password
async function savePassword() {
    const website = document.getElementById('website').value;
    const email = document.getElementById('email').value;
    const userPassword = document.getElementById('user-password').value;

    // Assuming you have a way to get the correct profile_id for the logged-in user
    const profile_id = 1; // This should be dynamically set based on the logged-in user's profile

    try {
        const response = await fetch('http://localhost:3000/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                profile_id,
                site_name: website,
                username: email,
                password_hash: userPassword,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Password saved:', data);
            
            // Clear input fields after saving
            document.getElementById('website').value = '';
            document.getElementById('email').value = '';
            document.getElementById('user-password').value = '';
        } else {
            const errorText = await response.text();
            console.error('Failed to save password:', errorText);
            alert('Failed to save password. Please try again.');
        }
    } catch (error) {
        console.error('Error saving password:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function to search for saved passwords
function searchPasswords() {
    const query = document.getElementById('search').value.toLowerCase();
    const passwords = document.getElementById('passwords');

    // Logic to filter and display passwords based on the search query
    const passwordTiles = document.querySelectorAll('.password-tile');
    passwordTiles.forEach(tile => {
        const siteName = tile.querySelector('h3').innerText.toLowerCase();
        if (siteName.includes(query)) {
            tile.style.display = 'block'; // Show matching tile
        } else {
            tile.style.display = 'none'; // Hide non-matching tile
        }
    });
}
