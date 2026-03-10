// ========== CUSTOM INGREDIENTS ==========
function loadCustomIngredients() {
    const saved = localStorage.getItem('gutwise_custom_ingredients');
    if (saved) {
        customIngredients = JSON.parse(saved);
    } else {
        customIngredients = [
            { name: 'Chicken breast', protein: 31, calories: 165, category: 'protein' },
            { name: 'White rice', protein: 2.7, calories: 130, category: 'grains' },
            { name: 'Eggs', protein: 13, calories: 155, category: 'protein' },
            { name: 'Broccoli', protein: 2.8, calories: 34, category: 'vegetables' },
            { name: 'Olive oil', protein: 0, calories: 884, category: 'spices' }
        ];
    }
    renderCustomIngredients();
}

function saveCustomIngredients() {
    localStorage.setItem('gutwise_custom_ingredients', JSON.stringify(customIngredients));
    if (currentUser) saveUserDataToFirestore(currentUser.uid);
}

function renderCustomIngredients() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    if (customIngredients.length === 0) {
        container.innerHTML = '<div style="color: #94a3b8; padding: 20px; text-align: center;">No custom ingredients yet. Add some!</div>';
        return;
    }
    
    const categories = {
        protein: { name: '🍗 Protein', icon: '🥩', items: [] },
        dairy: { name: '🥛 Dairy', icon: '🧀', items: [] },
        vegetables: { name: '🥦 Vegetables', icon: '🥬', items: [] },
        fruits: { name: '🍎 Fruits', icon: '🍌', items: [] },
        grains: { name: '🌾 Grains', icon: '🍚', items: [] },
        spices: { name: '🧂 Spices', icon: '🌶️', items: [] },
        other: { name: '📦 Other', icon: '📦', items: [] }
    };
    
    customIngredients.forEach(ing => {
        const cat = ing.category || 'other';
        if (categories[cat]) categories[cat].items.push(ing);
        else categories.other.items.push(ing);
    });
    
    let html = '';
    for (let [key, category] of Object.entries(categories)) {
        if (category.items.length === 0) continue;
        
        const isExpanded = localStorage.getItem(`category_${key}_expanded`) !== 'false';
        
        html += `
            <div class="category-section" data-category="${key}">
                <div class="category-header ${isExpanded ? 'expanded' : ''}" onclick="toggleCategory('${key}')">
                    <div class="category-title">
                        <span class="category-icon ${isExpanded ? 'expanded' : ''}">▶</span>
                        <span>${category.icon} ${category.name}</span>
                    </div>
                    <span class="category-count">${category.items.length}</span>
                </div>
                <div class="category-content ${isExpanded ? '' : 'collapsed'}">
        `;
        
        category.items.forEach(ing => {
            const globalIndex = customIngredients.findIndex(i => i.name === ing.name && i.category === ing.category);
            html += `
                <div class="category-ingredient">
                    <div class="ingredient-info">
                        <div class="ingredient-name">• ${ing.name}</div>
                        <div class="ingredient-nutrition">
                            <span>💪 ${ing.protein}g</span>
                            <span>🔥 ${ing.calories}kcal</span>
                        </div>
                    </div>
                    <div class="ingredient-actions">
                        <button class="ingredient-use-btn" onclick="useCustomIngredient(${globalIndex})">Use</button>
                        <button class="ingredient-delete-btn" onclick="deleteCustomIngredient(${globalIndex})">✕</button>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    container.innerHTML = html;
}

window.toggleCategory = function(category) {
    const section = document.querySelector(`.category-section[data-category="${category}"]`);
    const content = section.querySelector('.category-content');
    const header = section.querySelector('.category-header');
    const icon = section.querySelector('.category-icon');
    
    const isExpanded = content.classList.contains('collapsed');
    
    if (isExpanded) {
        content.classList.remove('collapsed');
        header.classList.add('expanded');
        icon.classList.add('expanded');
        localStorage.setItem(`category_${category}_expanded`, 'true');
    } else {
        content.classList.add('collapsed');
        header.classList.remove('expanded');
        icon.classList.remove('expanded');
        localStorage.setItem(`category_${category}_expanded`, 'false');
    }
};

window.useCustomIngredient = function(index) {
    const ing = customIngredients[index];
    document.getElementById('ingredient-name').value = ing.name;
    document.getElementById('ingredient-protein-per100').value = ing.protein;
    document.getElementById('ingredient-calories-per100').value = ing.calories;
    updateCalculation();
};

window.deleteCustomIngredient = function(index) {
    if (confirm('Delete this ingredient?')) {
        customIngredients.splice(index, 1);
        saveCustomIngredients();
        renderCustomIngredients();
    }
};

// Add new ingredient form
document.getElementById('show-add-ingredient-form-btn')?.addEventListener('click', () => {
    document.getElementById('add-ingredient-form').style.display = 'block';
});

document.getElementById('cancel-add-ingredient-btn')?.addEventListener('click', () => {
    document.getElementById('add-ingredient-form').style.display = 'none';
    document.getElementById('custom-ing-name').value = '';
    document.getElementById('custom-ing-protein').value = '';
    document.getElementById('custom-ing-calories').value = '';
    document.getElementById('custom-ing-category').value = 'protein';
});

document.getElementById('save-custom-ingredient-btn')?.addEventListener('click', () => {
    const name = document.getElementById('custom-ing-name').value.trim();
    const protein = parseFloat(document.getElementById('custom-ing-protein').value);
    const calories = parseFloat(document.getElementById('custom-ing-calories').value);
    const category = document.getElementById('custom-ing-category').value;
    
    if (!name || isNaN(protein) || protein < 0 || isNaN(calories) || calories <= 0) {
        alert('Please fill all fields with valid numbers');
        return;
    }
    
    if (customIngredients.some(ing => ing.name.toLowerCase() === name.toLowerCase())) {
        alert('An ingredient with this name already exists!');
        return;
    }
    
    customIngredients.push({ name, protein, calories, category });
    saveCustomIngredients();
    renderCustomIngredients();
    
    document.getElementById('add-ingredient-form').style.display = 'none';
    document.getElementById('custom-ing-name').value = '';
    document.getElementById('custom-ing-protein').value = '';
    document.getElementById('custom-ing-calories').value = '';
    document.getElementById('custom-ing-category').value = 'protein';
});