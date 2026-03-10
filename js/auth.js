// ========== AUTH FUNCTIONS ==========
async function signIn(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        alert('Sign in failed: ' + error.message);
    }
}

async function signUpWithDetails(name, email, password, height, goalWeight, proteinGoal) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        const calorieGoal = Math.round(goalWeight * 24 * 0.85);
        
        userProfile = {
            name: name,
            height: height,
            goalWeight: goalWeight,
            proteinGoal: proteinGoal,
            calorieGoal: calorieGoal
        };
        
        const today = new Date().toISOString().split('T')[0];
        logs = { [today]: { foods: [], symptoms: JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS)), workouts: [], weight: null } };
        
        customIngredients = [
            { name: 'Chicken breast', protein: 31, calories: 165, category: 'protein' },
            { name: 'White rice', protein: 2.7, calories: 130, category: 'grains' },
            { name: 'Eggs', protein: 13, calories: 155, category: 'protein' },
            { name: 'Broccoli', protein: 2.8, calories: 34, category: 'vegetables' },
            { name: 'Olive oil', protein: 0, calories: 884, category: 'spices' }
        ];
        
        saveToStorage();
        
        alert('Account created successfully! You are now logged in.');
        
    } catch (error) {
        console.error('Sign up error:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            alert('This email is already registered. Please use a different email or sign in.');
        } else if (error.code === 'auth/weak-password') {
            alert('Password is too weak. Please use at least 6 characters.');
        } else if (error.code === 'auth/invalid-email') {
            alert('Please enter a valid email address.');
        } else {
            alert('Sign up failed: ' + error.message);
        }
    }
}

async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Sign out error:', error);
        alert('Sign out failed: ' + error.message);
    }
}