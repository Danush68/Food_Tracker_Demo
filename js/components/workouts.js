// ========== WORKOUT FUNCTIONS ==========
function renderWorkouts() {
    const container = document.getElementById('workout-list');
    const dayWorkouts = logs[currentDate]?.workouts || [];
    
    if (dayWorkouts.length === 0) {
        container.innerHTML = '<div style="color: #94a3b8; padding: 20px; text-align: center;">No workouts logged yet.</div>';
        return;
    }
    
    let html = '';
    dayWorkouts.forEach((workout, index) => {
        html += `
            <div class="workout-item">
                <div>
                    <span style="font-weight:600;">${workout.name}</span><br>
                    <span style="font-size:0.85rem; color:#64748b;">${workout.duration} min · ${workout.calories ? workout.calories + ' kcal' : '—'}</span>
                </div>
                <button class="remove-btn" onclick="removeWorkout(${index})">✕</button>
            </div>
        `;
    });
    container.innerHTML = html;
    updateStats();
}

window.removeWorkout = function(index) {
    if (logs[currentDate] && logs[currentDate].workouts) {
        logs[currentDate].workouts.splice(index, 1);
        renderWorkouts();
        saveToStorage();
        calculateWeeklyStats();
    }
};

document.getElementById('add-workout-btn')?.addEventListener('click', function() {
    const name = document.getElementById('workout-name').value.trim();
    const duration = parseInt(document.getElementById('workout-duration').value);
    const caloriesInput = document.getElementById('workout-calories').value;
    const calories = caloriesInput ? parseInt(caloriesInput) : null;

    if (!name || isNaN(duration) || duration <= 0) {
        alert('Please enter a valid exercise name and duration.');
        return;
    }

    if (!logs[currentDate]) {
        logs[currentDate] = { foods: [], symptoms: JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS)), workouts: [], weight: null };
    }
    if (!logs[currentDate].workouts) logs[currentDate].workouts = [];

    logs[currentDate].workouts.push({
        name: name,
        duration: duration,
        calories: calories
    });

    renderWorkouts();
    saveToStorage();
    calculateWeeklyStats();

    document.getElementById('workout-name').value = '';
    document.getElementById('workout-duration').value = '30';
    document.getElementById('workout-calories').value = '';
});