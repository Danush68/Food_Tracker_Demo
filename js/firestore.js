// ========== FIRESTORE FUNCTIONS ==========
async function saveUserDataToFirestore(userId) {
    try {
        await db.collection('users').doc(userId).set({
            logs: logs,
            userProfile: userProfile,
            customIngredients: customIngredients,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving to cloud:', error);
    }
}

async function loadUserDataFromFirestore(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const data = doc.data();
            logs = data.logs || {};
            userProfile = data.userProfile || userProfile;
            customIngredients = data.customIngredients || [];
            
            localStorage.setItem('gutwise_logs', JSON.stringify(logs));
            localStorage.setItem('gutwise_profile', JSON.stringify(userProfile));
            localStorage.setItem('gutwise_custom_ingredients', JSON.stringify(customIngredients));
            
            return true;
        } else {
            loadFromStorage();
            await saveUserDataToFirestore(userId);
            return false;
        }
    } catch (error) {
        loadFromStorage();
        return false;
    }
}