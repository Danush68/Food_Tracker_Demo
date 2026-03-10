// ========== INSIGHTS FUNCTIONS ==========
function calculateWeeklyStats() {
    const dates = Object.keys(logs).sort().reverse().slice(0, 7);
    let weightData = [], calorieData = [], proteinData = [], workoutDurationData = [], workoutCalorieData = [];
    let totalWorkoutDuration = 0, totalWorkoutCalories = 0;
    
    dates.forEach((date) => {
        const dayData = logs[date] || { foods: [], workouts: [] };
        
        if (dayData.weight) {
            weightData.push({ date, value: dayData.weight });
        }
        
        const dayCalories = (dayData.foods || []).reduce((sum, f) => sum + f.calories, 0);
        const dayProtein = (dayData.foods || []).reduce((sum, f) => sum + f.protein, 0);
        const dayWorkouts = dayData.workouts || [];
        const dayWorkoutDuration = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const dayWorkoutCalories = dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        
        totalWorkoutDuration += dayWorkoutDuration;
        totalWorkoutCalories += dayWorkoutCalories;
        
        calorieData.push({ date, value: dayCalories });
        proteinData.push({ date, value: dayProtein });
        workoutDurationData.push({ date, value: dayWorkoutDuration });
        workoutCalorieData.push({ date, value: dayWorkoutCalories });
    });
    
    const avgCalories = calorieData.reduce((sum, d) => sum + d.value, 0) / dates.length || 0;
    const avgProtein = proteinData.reduce((sum, d) => sum + d.value, 0) / dates.length || 0;
    
    document.getElementById('calorieAvg').innerHTML = Math.round(avgCalories) + ' avg';
    document.getElementById('proteinAvg').innerHTML = avgProtein.toFixed(1) + ' avg';
    document.getElementById('workoutCount').innerHTML = workoutDurationData.filter(d => d.value > 0).length + ' sessions';
    document.getElementById('totalDuration').innerHTML = totalWorkoutDuration;
    document.getElementById('totalBurned').innerHTML = Math.round(totalWorkoutCalories);
    
    document.getElementById('calorieGoal').innerHTML = userProfile.calorieGoal;
    document.getElementById('proteinGoal').innerHTML = userProfile.proteinGoal;
    
    const calorieVsGoal = (avgCalories / userProfile.calorieGoal * 100).toFixed(0);
    const proteinVsGoal = (avgProtein / userProfile.proteinGoal * 100).toFixed(0);
    document.getElementById('calorieVsGoal').innerHTML = calorieVsGoal + '%';
    document.getElementById('proteinVsGoal').innerHTML = proteinVsGoal + '%';
    
    if (weightData.length >= 2) {
        const sorted = weightData.sort((a, b) => new Date(a.date) - new Date(b.date));
        const first = sorted[0].value;
        const last = sorted[sorted.length-1].value;
        const change = (last - first).toFixed(1);
        document.getElementById('weightChange').innerHTML = (change > 0 ? '+' : '') + change + ' kg';
    } else if (weightData.length === 1) {
        document.getElementById('weightChange').innerHTML = '1 weigh-in';
    } else {
        document.getElementById('weightChange').innerHTML = 'No data';
    }
    
    renderWeightChart(weightData);
    renderChart('calorieChart', calorieData.map(d => d.value), userProfile.calorieGoal);
    renderChart('proteinChart', proteinData.map(d => d.value), userProfile.proteinGoal);
    renderChart('workoutDurationChart', workoutDurationData.map(d => d.value));
    renderChart('workoutCaloriesChart', workoutCalorieData.map(d => d.value));
    
    generateWeeklySummary(avgCalories, avgProtein, totalWorkoutDuration, totalWorkoutCalories, weightData);
}

function renderWeightChart(weightData) {
    const container = document.getElementById('weightChart');
    if (!container) return;
    if (weightData.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 20px;">No weight data this week</div>';
        return;
    }
    weightData.sort((a,b)=>new Date(a.date)-new Date(b.date));
    const values = weightData.map(d=>d.value);
    const max = Math.max(...values, userProfile.goalWeight);
    const min = Math.min(...values, userProfile.goalWeight);
    const range = max-min || 1;
    let html = '';
    weightData.forEach(item => {
        const height = ((item.value - min) / range) * 80 + 20;
        const date = new Date(item.date+'T12:00:00').toLocaleDateString('en-US', {weekday:'short'});
        html += `
            <div style="flex:1; display: flex; flex-direction: column; align-items: center;">
                <div style="width:100%; position:relative;">
                    <div class="chart-bar weight-bar" style="height:${height}px;"></div>
                    <div class="chart-bar-value" style="color:#10b981;">${item.value.toFixed(1)}</div>
                </div>
                <div class="chart-bar-label">${date}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderChart(elementId, data, goalLine = null) {
    const container = document.getElementById(elementId);
    if (!container) return;
    if (data.length === 0 || data.every(v=>v===0)) {
        container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 20px;">No data this week</div>';
        return;
    }
    const max = Math.max(...data, goalLine||0, 10);
    const days = ['M','T','W','T','F','S','S'];
    let html = '';
    data.slice(0,7).forEach((val,i)=>{
        const height = (val / max) * 100;
        html += `
            <div style="flex:1; display: flex; flex-direction: column; align-items: center;">
                <div style="width:100%; position:relative;">
                    <div class="chart-bar" style="height:${Math.max(height,5)}px;"></div>
                    <div class="chart-bar-value">${Math.round(val)}</div>
                </div>
                <div class="chart-bar-label">${days[i]}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function generateWeeklySummary(avgCalories, avgProtein, totalDuration, totalCalories, weightData) {
    const summary = document.getElementById('weeklySummary');
    let text = '';
    if (avgCalories > userProfile.calorieGoal*1.1) text += '• 🔥 Calories 10% above goal<br>';
    else if (avgCalories < userProfile.calorieGoal*0.9) text += '• ✅ Calories 10% below goal<br>';
    else text += '• 📊 Calories on track<br>';
    
    if (avgProtein > userProfile.proteinGoal*0.9) text += '• 💪 Excellent protein<br>';
    else text += '• ⚠️ Protein below goal<br>';
    
    if (totalDuration > 0) {
        text += `• 🏋️ ${totalDuration} min workouts<br>`;
        if (totalCalories > 0) text += `• 🔥 ~${Math.round(totalCalories)} kcal burned<br>`;
    } else text += '• 😴 No workouts<br>';
    
    if (weightData.length >= 2) {
        const sorted = weightData.sort((a,b)=>new Date(a.date)-new Date(b.date));
        const first = sorted[0].value, last = sorted[sorted.length-1].value;
        const change = (last-first).toFixed(1);
        if (change > 0) text += `• ⚖️ +${change}kg<br>`;
        else if (change < 0) text += `• ⚖️ ${change}kg loss<br>`;
        else text += '• ⚖️ Stable<br>';
    } else if (weightData.length === 1) text += '• ⚖️ One weigh-in<br>';
    else text += '• ⚖️ No weight data<br>';
    
    summary.innerHTML = text;
}