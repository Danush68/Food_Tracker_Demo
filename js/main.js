// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    updateDateDisplay();
    loadCurrentDay();
    setupEventListeners();
    updateStats();
    loadCustomIngredients();
    
    // Input listeners
    document.getElementById('ingredient-grams')?.addEventListener('input', updateCalculation);
    document.getElementById('ingredient-protein-per100')?.addEventListener('input', updateCalculation);
    document.getElementById('ingredient-calories-per100')?.addEventListener('input', updateCalculation);
});

function loadCurrentDay() {
    if (!logs[currentDate]) {
        logs[currentDate] = { 
            foods: [], 
            symptoms: JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS)), 
            workouts: [],
            weight: null
        };
    }
    renderFoods();
    renderSymptoms();
    renderWorkouts();
    updateWeightDisplay();
    calculateWeeklyStats();
}

function setupEventListeners() {
    // Date navigation
    document.getElementById('prevDay')?.addEventListener('click', () => {
        let d = new Date(currentDate + 'T12:00:00');
        d.setDate(d.getDate() - 1);
        currentDate = d.toISOString().split('T')[0];
        updateDateDisplay();
        loadCurrentDay();
    });

    document.getElementById('nextDay')?.addEventListener('click', () => {
        let d = new Date(currentDate + 'T12:00:00');
        d.setDate(d.getDate() + 1);
        currentDate = d.toISOString().split('T')[0];
        updateDateDisplay();
        loadCurrentDay();
    });

    document.getElementById('todayBtn')?.addEventListener('click', () => {
        currentDate = new Date().toISOString().split('T')[0];
        updateDateDisplay();
        loadCurrentDay();
    });

    // Profile toggle
    const toggleBtn = document.getElementById('toggleProfileBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const panel = document.getElementById('profilePanel');
            if (panel) {
                panel.classList.toggle('hidden');
                if (!panel.classList.contains('hidden')) {
                    document.getElementById('settingsName').value = userProfile.name || 'Guest';
                    document.getElementById('settingsHeight').value = userProfile.height;
                    document.getElementById('settingsGoalWeight').value = userProfile.goalWeight;
                    document.getElementById('settingsProteinGoal').value = userProfile.proteinGoal;
                    document.getElementById('settingsCalorieGoal').value = userProfile.calorieGoal;
                }
            }
        });
    }

    // Save profile
    document.getElementById('saveSettingsBtn')?.addEventListener('click', function() {
        const newName = document.getElementById('settingsName').value.trim() || 'User';
        userProfile = {
            name: newName,
            height: parseFloat(document.getElementById('settingsHeight').value) || 183,
            goalWeight: parseFloat(document.getElementById('settingsGoalWeight').value) || 85,
            proteinGoal: parseFloat(document.getElementById('settingsProteinGoal').value) || 140,
            calorieGoal: parseFloat(document.getElementById('settingsCalorieGoal').value) || 2200
        };
        document.getElementById('userNameDisplay').textContent = newName;
        updateStats();
        saveToStorage();
        alert('Profile updated!');
        document.getElementById('profilePanel').classList.add('hidden');
    });

    // Double‑click stats
    document.getElementById('stat-height')?.addEventListener('dblclick', function() {
        const newValue = prompt('Enter new height (cm):', userProfile.height);
        if (newValue && !isNaN(newValue) && parseFloat(newValue) > 0) {
            userProfile.height = parseFloat(newValue);
            updateStats();
            saveToStorage();
        }
    });

    document.getElementById('stat-protein')?.addEventListener('dblclick', function() {
        const newValue = prompt('Enter new protein goal (g):', userProfile.proteinGoal);
        if (newValue && !isNaN(newValue) && parseFloat(newValue) > 0) {
            userProfile.proteinGoal = parseFloat(newValue);
            updateStats();
            saveToStorage();
        }
    });

    document.getElementById('stat-calorie-net')?.addEventListener('dblclick', function() {
        const newValue = prompt('Enter new calorie goal:', userProfile.calorieGoal);
        if (newValue && !isNaN(newValue) && parseFloat(newValue) > 0) {
            userProfile.calorieGoal = parseFloat(newValue);
            updateStats();
            saveToStorage();
        }
    });

    // History modal
    document.getElementById('showHistoryBtn')?.addEventListener('click', () => {
        renderHistory();
        document.getElementById('historyModal').style.display = 'flex';
    });

    document.getElementById('closeModal')?.addEventListener('click', () => {
        document.getElementById('historyModal').style.display = 'none';
    });

    window.onclick = function(event) {
        const modal = document.getElementById('historyModal');
        if (event.target === modal) modal.style.display = 'none';
    };

    // Sign in / up
    document.getElementById('signInBtn')?.addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        if (email && pass) signIn(email, pass);
        else alert('Enter email and password');
    });

    document.getElementById('signUpBtn')?.addEventListener('click', function() {
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('signupContainer').classList.add('active');
    });

    document.getElementById('backToLoginBtn')?.addEventListener('click', function() {
        document.getElementById('signupContainer').classList.remove('active');
        document.getElementById('loginContainer').classList.remove('hidden');
    });

    document.getElementById('backToLoginLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('signupContainer').classList.remove('active');
        document.getElementById('loginContainer').classList.remove('hidden');
    });

    document.getElementById('createAccountBtn')?.addEventListener('click', async function() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const height = parseFloat(document.getElementById('signupHeight').value);
        const goalWeight = parseFloat(document.getElementById('signupGoalWeight').value);
        const proteinGoal = parseFloat(document.getElementById('signupProteinGoal').value);

        if (!name || !email || !password || isNaN(height) || isNaN(goalWeight) || isNaN(proteinGoal)) {
            alert('Please fill all fields');
            return;
        }
        if (password.length < 6) { alert('Password min 6 characters'); return; }
        if (height <= 0 || goalWeight <= 0 || proteinGoal <= 0) { alert('Positive numbers only'); return; }

        await signUpWithDetails(name, email, password, height, goalWeight, proteinGoal);
    });

    document.getElementById('logoutBtn')?.addEventListener('click', signOut);

    // Export/Import
    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
        const data = { logs, userProfile, customIngredients };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    });

    document.getElementById('importDataBtn')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.logs) logs = data.logs;
                    if (data.userProfile) userProfile = data.userProfile;
                    if (data.customIngredients) customIngredients = data.customIngredients;
                    saveToStorage();
                    loadCurrentDay();
                    renderCustomIngredients();
                    calculateWeeklyStats();
                    alert('Data restored!');
                } catch (err) {
                    alert('Invalid file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
}

// ========== HISTORY RENDERING ==========
function renderHistory() {
    const container = document.getElementById('historyList');
    const dates = Object.keys(logs).sort().reverse();
    if (dates.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px;">No history yet.</div>';
        return;
    }
    let html = '';
    dates.forEach(date => {
        const dayData = logs[date];
        const foodCount = dayData.foods.length;
        const workoutCount = dayData.workouts?.length || 0;
        const dateObj = new Date(date + 'T12:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        html += `
            <div class="history-item" onclick="jumpToDate('${date}')">
                <div class="history-date">${formattedDate}</div>
                <div class="history-stats">
                    <span>🍽️ ${foodCount} foods</span>
                    <span>🏋️ ${workoutCount} workouts</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

window.jumpToDate = function(date) {
    currentDate = date;
    updateDateDisplay();
    loadCurrentDay();
    document.getElementById('historyModal').style.display = 'none';
};