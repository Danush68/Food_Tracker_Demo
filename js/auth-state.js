// ========== AUTH STATE ==========
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('userEmail').textContent = user.email;
        document.body.classList.add('logged-in');
        
        await loadUserDataFromFirestore(user.uid);
        
        if (userProfile.name) {
            document.getElementById('userNameDisplay').textContent = userProfile.name;
        }
        
        loadCurrentDay();
        renderCustomIngredients();
        updateStats();
        calculateWeeklyStats();
    } else {
        currentUser = null;
        document.body.classList.remove('logged-in');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('userNameDisplay').textContent = 'Guest';
        isFirstTimeUser = false;
    }
});