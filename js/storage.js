// ========== STORAGE ==========
function saveToStorage() {
    localStorage.setItem('gutwise_logs', JSON.stringify(logs));
    localStorage.setItem('gutwise_profile', JSON.stringify(userProfile));
    localStorage.setItem('gutwise_custom_ingredients', JSON.stringify(customIngredients));
    
    if (currentUser) saveUserDataToFirestore(currentUser.uid);
}

function loadFromStorage() {
    const savedLogs = localStorage.getItem('gutwise_logs');
    const savedProfile = localStorage.getItem('gutwise_profile');
    const savedCustom = localStorage.getItem('gutwise_custom_ingredients');
    
    if (savedLogs) logs = JSON.parse(savedLogs);
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        if (userProfile.name) {
            document.getElementById('userNameDisplay').textContent = userProfile.name;
        }
    }
    if (savedCustom) customIngredients = JSON.parse(savedCustom);
}