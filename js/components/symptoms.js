// ========== SYMPTOM FUNCTIONS ==========
function renderSymptoms() {
    const container = document.getElementById('symptom-list');
    let symptoms = logs[currentDate]?.symptoms || JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS));
    
    let html = '';
    symptoms.forEach(symptom => {
        const requiredStar = symptom.required ? ' <span style="color:#ef4444;">*</span>' : '';
        html += `
            <div class="symptom-item">
                <div class="symptom-header">
                    <span class="symptom-name">${symptom.name}${requiredStar}</span>
                </div>
                <div class="rating">
                    ${[1,2,3,4,5].map(num => `
                        <span class="rating-circle ${symptom.value === num ? 'selected' : ''}" 
                              onclick="setSymptomValue('${symptom.id}', ${num})">${num}</span>
                    `).join('')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

window.setSymptomValue = function(symptomId, value) {
    const symptom = logs[currentDate].symptoms.find(s => s.id === symptomId);
    if (symptom) {
        symptom.value = value;
        renderSymptoms();
        saveToStorage();
    }
};

document.getElementById('add-symptom-btn')?.addEventListener('click', () => {
    const name = document.getElementById('new-symptom-name').value.trim();
    if (!name) return;
    
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (!logs[currentDate]) {
        logs[currentDate] = { foods: [], symptoms: JSON.parse(JSON.stringify(DEFAULT_SYMPTOMS)), workouts: [], weight: null };
    }
    if (!logs[currentDate].symptoms.some(s => s.id === id)) {
        logs[currentDate].symptoms.push({ id, name, value: null, required: false });
        document.getElementById('new-symptom-name').value = '';
        renderSymptoms();
        saveToStorage();
    }
});

document.getElementById('save-symptoms-btn')?.addEventListener('click', () => {
    saveToStorage();
    alert('Symptoms saved!');
});