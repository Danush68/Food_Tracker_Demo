// ========== FOOD FUNCTIONS ==========
function renderFoods() {
    const container = document.getElementById('food-list-container');
    const foods = logs[currentDate]?.foods || [];
    
    if (foods.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 30px;">No foods logged yet.</div>';
        updateStats();
        return;
    }

    let html = '';
    foods.forEach((food, index) => {
        html += `<div class="food-item safe">
            <div class="food-info">
                <span class="food-name">${food.name}</span>
            </div>
            <div style="display:flex; align-items:center;">
                <div class="food-stats">${food.protein.toFixed(1)}g • ${Math.round(food.calories)}kcal</div>
                <button class="remove-btn" onclick="removeFood(${index})">✕</button>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
    updateStats();
}

window.removeFood = function(index) {
    logs[currentDate].foods.splice(index, 1);
    renderFoods();
    saveToStorage();
    calculateWeeklyStats();
};

// ========== INGREDIENT LOGGING ==========
function updateCalculation() {
    const grams = parseFloat(document.getElementById('ingredient-grams').value) || 0;
    const protein = parseFloat(document.getElementById('ingredient-protein-per100').value) || 0;
    const calories = parseFloat(document.getElementById('ingredient-calories-per100').value) || 0;
    
    document.getElementById('calc-protein').textContent = ((protein * grams) / 100).toFixed(1);
    document.getElementById('calc-calories').textContent = Math.round((calories * grams) / 100);
}

function renderIngredients() {
    const container = document.getElementById('ingredients-list');
    
    if (currentIngredients.length === 0) {
        container.innerHTML = '<div style="color: #94a3b8; padding: 10px;">No ingredients added yet.</div>';
        return;
    }
    
    let html = '';
    let totalProtein = 0, totalCalories = 0;
    
    currentIngredients.forEach((ing, index) => {
        totalProtein += ing.protein;
        totalCalories += ing.calories;
        html += `
            <div class="ingredient-row">
                <div><span>${ing.name}</span><span style="color: #64748b; margin-left: 8px;">${ing.grams}g</span></div>
                <div>
                    <span style="color: #3b82f6;">${ing.protein.toFixed(1)}g</span> • 
                    <span>${Math.round(ing.calories)} kcal</span>
                    <span class="remove-ing" onclick="removeIngredient(${index})">✕</span>
                </div>
            </div>
        `;
    });
    
    html += `<div class="total-row"><span>TOTAL</span><span>${totalProtein.toFixed(1)}g • ${Math.round(totalCalories)} kcal</span></div>`;
    container.innerHTML = html;
}

window.removeIngredient = function(index) {
    currentIngredients.splice(index, 1);
    renderIngredients();
};

// ========== SAVE MEAL ==========
document.getElementById('save-meal-btn')?.addEventListener('click', function() {
    if (currentIngredients.length === 0) {
        alert('Add at least one ingredient first!');
        return;
    }
    
    const totalProtein = currentIngredients.reduce((sum, i) => sum + i.protein, 0);
    const totalCalories = currentIngredients.reduce((sum, i) => sum + i.calories, 0);
    const mealName = currentIngredients.map(i => i.name).slice(0, 2).join(' + ') + 
                   (currentIngredients.length > 2 ? ` +${currentIngredients.length-2}` : '');
    
    if (!logs[currentDate]) {
        logs[currentDate] = { foods: [], symptoms: JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS)), workouts: [], weight: null };
    }
    logs[currentDate].foods.push({ name: mealName, protein: totalProtein, calories: totalCalories });
    
    currentIngredients = [];
    renderIngredients();
    renderFoods();
    saveToStorage();
    calculateWeeklyStats();
});

// Add ingredient button
document.getElementById('add-ingredient-btn')?.addEventListener('click', function() {
    const name = document.getElementById('ingredient-name').value.trim();
    const grams = parseFloat(document.getElementById('ingredient-grams').value);
    const protein = parseFloat(document.getElementById('ingredient-protein-per100').value);
    const calories = parseFloat(document.getElementById('ingredient-calories-per100').value);
    
    if (!name || grams <= 0 || protein < 0 || calories <= 0) {
        alert('Please fill all fields with valid numbers');
        return;
    }
    
    currentIngredients.push({
        name, grams,
        protein: (protein * grams / 100),
        calories: (calories * grams / 100)
    });
    
    renderIngredients();
    
    document.getElementById('ingredient-name').value = '';
    document.getElementById('ingredient-grams').value = '100';
    document.getElementById('ingredient-protein-per100').value = '';
    document.getElementById('ingredient-calories-per100').value = '';
    updateCalculation();
});

// Input listeners
document.getElementById('ingredient-grams')?.addEventListener('input', updateCalculation);
document.getElementById('ingredient-protein-per100')?.addEventListener('input', updateCalculation);
document.getElementById('ingredient-calories-per100')?.addEventListener('input', updateCalculation);