# 🍽️ Food Tracker – Cross‑Device Sync

A full‑featured food, symptom, and workout tracker that helps you understand your body and reach your health goals.  
Log your meals with custom ingredients, track symptoms and workouts, see weekly insights, and sync everything across devices using Firebase.

![App Screenshot](screenshot.png) <!-- Replace with an actual screenshot if you have one -->

---

## ✨ Features

- **🔐 User authentication** – Sign up / Sign in with email (Firebase Auth)
- **📅 Daily logging** – Each day has its own foods, symptoms, workouts, and weight
- **🥗 Ingredient‑based food logging** – Add ingredients with per‑100g values, build complete meals
- **📚 Custom ingredients library** – Save your own ingredients, organised into categories (Protein, Dairy, Vegetables, etc.)
- **😖 Symptom tracking** – Rate symptoms on a 1‑5 scale, add custom symptoms
- **💪 Workout logging** – Record exercise name, duration, and optional calories burned
- **⚖️ Weight tracking** – Optional per‑day weight entries; previous days remain unchanged
- **📊 Weekly insights dashboard** – Charts and summaries for weight, calories, protein, and workouts
- **☁️ Cross‑device sync** – All data stored in Firebase Firestore; log in on any device to see your data
- **💾 Local backup / restore** – Export your data to a JSON file, or restore from a backup
- **📱 Responsive design** – Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (vanilla, no frameworks)
- **Backend & Auth:** Firebase (Authentication + Firestore)
- **Build tool:** Python script to combine HTML partials
- **Hosting:** GitHub Pages / Netlify (static hosting)

---

## 📁 Project Structure
project/
│
├── src/ # Source files (you edit these)
│ └── partials/ # HTML pieces
│ ├── _base.html
│ ├── _login.html
│ ├── _signup.html
│ ├── _app-header.html
│ ├── _app-main.html
│ ├── _app-weight.html
│ ├── _app-symptoms-workout.html
│ ├── _app-insights.html
│ ├── _profile-panel.html
│ ├── _history-modal.html
│ └── _footer.html
│
├── css/ # Stylesheets
│ ├── main.css
│ ├── login.css
│ ├── app.css
│ └── components/
│ ├── ingredient-form.css
│ ├── workout-card.css
│ └── insights.css
│
├── js/ # JavaScript modules
│ ├── firebase-config.js
│ ├── data-structures.js
│ ├── firestore.js
│ ├── storage.js
│ ├── auth.js
│ ├── auth-state.js
│ ├── utils.js
│ └── components/
│ ├── food-logging.js
│ ├── custom-ingredients.js
│ ├── symptoms.js
│ ├── workouts.js
│ ├── weight.js
│ └── insights.js
│
├── build.py # Python script to build index.html
├── index.html # Generated output (do not edit directly)
└── README.md # This file


---

## 🚀 Getting Started

### 1. Clone the repository
bash
git clone https://github.com/your-username/food-tracker.git
cd food-tracker

### 2. Set up Firebase
Go to the Firebase Console and create a new project.

Enable Email/Password authentication.

Create a Firestore database (start in test mode for development).

In your project settings, copy the Firebase config object.

Open js/firebase-config.js and replace the placeholder config with your own:
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

### 3. Run a local server (required, because of CORS)

Do not open index.html directly with file://. Use a simple HTTP server:

Python 3:python -m http.server 8000

Then open http://localhost:8000 in your browser.

### 4. Build the final HTML (when you change partials)

If you edit any of the HTML partials in src/partials/, you need to rebuild index.html:
python build.py


🧪 Development Workflow
Edit HTML partials, CSS, or JS.

Test locally with the server (live reload not built‑in, just refresh the page).

If you changed HTML partials, run python build.py to regenerate index.html.

Commit and push your changes.

🌍 Deployment
GitHub Pages
Push your repository to GitHub.

Go to Settings → Pages.

Set the source branch to main and folder to / (root).

Your site will be published at https://your-username.github.io/repo-name/.

Netlify
Go to app.netlify.com.

Drag and drop your project folder (with index.html, css/, js/) onto the upload area.

Netlify gives you a URL – done!

🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

📄 License
This project is open source and available under the MIT License.

🙏 Acknowledgements
Built with vanilla JavaScript – no frameworks, just pure code.

Icons from system fonts (no external icon libraries).

