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
