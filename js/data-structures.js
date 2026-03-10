// ========== DATA STRUCTURES ==========
let logs = {};
let currentDate = new Date().toISOString().split('T')[0];
let currentUser = null;
let isFirstTimeUser = false;
let currentIngredients = [];
let customIngredients = [];

const DEFAULT_SYMPTOMS = [
    { id: 'bloating', name: 'Bloating', value: null, required: true },
    { id: 'pain', name: 'Abdominal Pain', value: null, required: true },
    { id: 'gas', name: 'Gas / Urgency', value: null, required: true }
];

let userProfile = {
    name: 'Guest',
    height: 183,
    goalWeight: 85,
    proteinGoal: 140,
    calorieGoal: 2200
};