// ========== DATE FUNCTIONS ==========
function updateDateDisplay() {
    const display = document.getElementById('currentDateDisplay');
    const dateObj = new Date(currentDate + 'T12:00:00');
    display.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ========== STATS UPDATE ==========
function updateStats() {
    const dayData = logs[currentDate] || { foods: [], workouts: [] };
    const foods = dayData.foods || [];
    const workouts = dayData.workouts || [];

    const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
    const totalFoodCalories = foods.reduce((sum, f) => sum + f.calories, 0);
    const totalWorkoutCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
    const netCalories = totalFoodCalories - totalWorkoutCalories;

    document.getElementById('protein-display').innerHTML = totalProtein.toFixed(1) + '<span class="stat-unit">g</span>';
    document.getElementById('height-display').innerHTML = userProfile.height + '<span class="stat-unit">cm</span>';
    document.getElementById('calorie-food-display').innerHTML = Math.round(totalFoodCalories) + '<span class="stat-unit">kcal</span>';
    document.getElementById('calorie-burned-display').innerHTML = Math.round(totalWorkoutCalories) + '<span class="stat-unit">kcal</span>';
    document.getElementById('calorie-net-display').innerHTML = Math.round(netCalories) + '<span class="stat-unit">kcal</span>';

    const calorieRemaining = userProfile.calorieGoal - netCalories;
    let netText = `Net ${Math.round(netCalories)} of ${userProfile.calorieGoal}`;
    if (calorieRemaining > 0) {
        netText += ` (${Math.round(calorieRemaining)} left)`;
    } else if (calorieRemaining < 0) {
        netText += ` (${Math.abs(Math.round(calorieRemaining))} over)`;
    } else {
        netText += ` 🎯 Goal met!`;
    }
    document.getElementById('calorie-net-progress').textContent = netText;

    const proteinRemaining = userProfile.proteinGoal - totalProtein;
    if (proteinRemaining > 0) {
        document.getElementById('protein-progress').textContent = `${totalProtein.toFixed(1)}g of ${userProfile.proteinGoal}g (${proteinRemaining.toFixed(1)}g left)`;
    } else {
        document.getElementById('protein-progress').textContent = `${totalProtein.toFixed(1)}g of ${userProfile.proteinGoal}g 🎯 Goal met!`;
    }
}

// ========== WEIGHT FUNCTIONS ==========
function updateWeightDisplay() {
    const dayData = logs[currentDate] || {};
    const todayWeight = dayData.weight;
    
    if (todayWeight) {
        document.getElementById('weight-display').innerHTML = todayWeight + '<span class="stat-unit">kg</span>';
        const weightDiff = todayWeight - userProfile.goalWeight;
        if (weightDiff > 0) {
            document.getElementById('weight-progress').textContent = `−${weightDiff.toFixed(1)}kg to goal`;
        } else if (weightDiff < 0) {
            document.getElementById('weight-progress').textContent = `+${Math.abs(weightDiff).toFixed(1)}kg above goal`;
        } else {
            document.getElementById('weight-progress').textContent = `🎯 Goal reached!`;
        }
    } else {
        document.getElementById('weight-display').innerHTML = '--<span class="stat-unit">kg</span>';
        document.getElementById('weight-progress').textContent = 'Not logged today';
    }
}