// ========== WEIGHT TRACKING ==========
document.getElementById('saveWeightBtn')?.addEventListener('click', function() {
    const weightInput = document.getElementById('todayWeight').value;
    const weight = parseFloat(weightInput);
    
    if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid weight');
        return;
    }
    
    if (!logs[currentDate]) {
        logs[currentDate] = { foods: [], symptoms: JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS)), workouts: [], weight: weight };
    } else {
        logs[currentDate].weight = weight;
    }
    
    updateWeightDisplay();
    saveToStorage();
    calculateWeeklyStats();
    
    document.getElementById('todayWeight').value = '';
    
    alert(`Weight saved for ${new Date(currentDate + 'T12:00:00').toLocaleDateString()}`);
});