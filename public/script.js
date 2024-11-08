// Login function
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

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
            alert('Login successful!');
            // Redirect to a different page (for example, inside the app after login)
            // window.location.href = "/dashboard";  // Uncomment and change URL if needed
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

// Register function
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User registered:', data);
            alert('Registration successful! You can now login.');
            showLoginForm();  // Show the login form after successful registration
        } else {
            const errorText = await response.text();
            console.error('Registration failed:', errorText);
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred. Please try again.');
    }
}

// Show register form
function showRegisterForm() {
    document.querySelector('.login-screen').classList.add('hidden');
    document.querySelector('.register-screen').classList.remove('hidden');
}

// Show login form
function showLoginForm() {
    document.querySelector('.register-screen').classList.add('hidden');
    document.querySelector('.login-screen').classList.remove('hidden');
}
